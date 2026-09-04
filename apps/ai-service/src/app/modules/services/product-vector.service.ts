import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Document } from '@langchain/core/documents';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProductAiGrpcClientService } from './product-ai.service';

export type SemanticProduct = {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  brandName: string;
  categoryName: string;
  score: number;
};

type ProductMetadata = Omit<SemanticProduct, 'score'>;

/** Số sản phẩm kéo về mỗi lần index lại. */
const REINDEX_LIMIT = 500;

/**
 * Tìm kiếm sản phẩm theo ngữ nghĩa.
 *
 * Dùng bảng pgvector RIÊNG với bảng tài liệu của chatbot (`chatbot_documents`):
 * trộn chung thì kết quả tìm sản phẩm sẽ lẫn các đoạn PDF đã ingest.
 */
@Injectable()
export class ProductVectorService implements OnModuleInit {
  private embeddings!: EmbeddingsInterface;
  private vectorStore!: PGVectorStore;

  constructor(
    private readonly configService: ConfigService,
    private readonly productGrpc: ProductAiGrpcClientService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.embeddings = new OpenAIEmbeddings({
      apiKey: this.configService.getOrThrow<string>('OPENROUTER_API_KEY'),
      model: this.configService.get<string>('EMBEDDING_MODEL', 'perplexity/pplx-embed-v1-0.6b'),
      configuration: {
        baseURL: this.configService.get<string>(
          'OPENROUTER_BASE_URL',
          'https://openrouter.ai/api/v1',
        ),
      },
    });

    this.vectorStore = await PGVectorStore.initialize(this.embeddings, {
      postgresConnectionOptions: {
        type: 'postgres',
        host: this.configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: Number(this.configService.get<string>('POSTGRES_PORT', '5432')),
        user: this.configService.get<string>('POSTGRES_USER', 'postgres'),
        password: this.configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
        database: this.configService.get<string>('POSTGRES_DB', 'chatbot_db'),
      },
      tableName: this.configService.get<string>('PGVECTOR_PRODUCT_TABLE', 'product_embeddings'),
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'embedding',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
    });

    Logger.log('PGVector product index ready', 'ProductVectorService');
  }

  /**
   * Nạp lại toàn bộ sản phẩm vào index.
   * Gọi lại sau khi thêm/sửa sản phẩm — hiện là thao tác thủ công của admin.
   */
  async reindexAll(): Promise<{ indexed: number }> {
    const products = await this.productGrpc.searchProductsForAdvisor({
      keyword: '',
      limit: REINDEX_LIMIT,
    });

    if (!products.length) {
      return { indexed: 0 };
    }

    const documents = products.map(
      (product) =>
        new Document({
          pageContent: [
            product.product_name,
            product.brand_name,
            product.category_name,
            product.short_description,
            product.description,
          ]
            .filter(Boolean)
            .join('\n'),
          metadata: {
            productId: product.product_id,
            name: product.product_name,
            slug: product.slug,
            thumbnail: product.thumbnail || '',
            price: Number(product.price ?? 0),
            brandName: product.brand_name ?? '',
            categoryName: product.category_name ?? '',
          } satisfies ProductMetadata,
        }),
    );

    // Xoá trước rồi nạp lại để index không giữ sản phẩm đã bị xoá/ẩn.
    await this.vectorStore.delete({ filter: {} }).catch(() => undefined);
    await this.vectorStore.addDocuments(documents);

    Logger.log(`Đã index ${documents.length} sản phẩm`, 'ProductVectorService');

    return { indexed: documents.length };
  }

  async search(query: string, limit = 8): Promise<SemanticProduct[]> {
    if (!query.trim()) return [];

    const results = await this.vectorStore.similaritySearchWithScore(query, limit);

    return results.map(([doc, score]) => ({ ...(doc.metadata as ProductMetadata), score }));
  }

  /** Sản phẩm tương tự: tìm hàng xóm gần nhất rồi bỏ chính nó ra. */
  async similarTo(productId: string, limit = 8): Promise<SemanticProduct[]> {
    const seed = await this.vectorStore.similaritySearchWithScore('', 1, { productId });

    const seedDoc = seed[0]?.[0];

    if (!seedDoc) return [];

    const results = await this.vectorStore.similaritySearchWithScore(seedDoc.pageContent, limit + 1);

    return results
      .map(([doc, score]) => ({ ...(doc.metadata as ProductMetadata), score }))
      .filter((item) => item.productId !== productId)
      .slice(0, limit);
  }
}
