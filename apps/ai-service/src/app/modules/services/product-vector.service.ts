import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IndexableProduct } from '../dto/product-ai.dto';
import { EmbeddingService } from './embedding.service';
import { ProductAiGrpcClientService } from './product-ai.service';
import { QdrantPoint, QdrantService } from './qdrant.service';

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

type ProductPayload = Omit<SemanticProduct, 'score'>;

/** Số sản phẩm kéo về mỗi lần index lại toàn bộ. */
const REINDEX_LIMIT = 500;

/**
 * Tìm kiếm sản phẩm theo ngữ nghĩa trên Qdrant.
 *
 * Điểm trong collection dùng chính `productId` (UUID) làm id, nên cập nhật một
 * sản phẩm chỉ là ghi đè đúng điểm đó — không cần index lại cả kho.
 */
@Injectable()
export class ProductVectorService implements OnModuleInit {
  private readonly collection: string;

  private ready?: Promise<void>;

  constructor(
    private readonly configService: ConfigService,
    private readonly productGrpc: ProductAiGrpcClientService,
    private readonly qdrant: QdrantService,
    private readonly embedding: EmbeddingService,
  ) {
    this.collection = this.configService.get<string>(
      'QDRANT_PRODUCT_COLLECTION',
      'product_embeddings',
    );
  }

  /**
   * Chuẩn bị collection ở nền, nhưng KHÔNG để lỗi làm sập tiến trình: số chiều
   * vector phải hỏi nhà cung cấp embedding, mà dịch vụ đó chết hay hết hạn key
   * thì cả ai-service không được vì thế mà crash-loop.
   */
  onModuleInit(): void {
    this.ensureReady().catch((error) => {
      Logger.warn(
        `Chưa dựng được collection "${this.collection}": ${error}`,
        ProductVectorService.name,
      );
    });
  }

  private ensureReady(): Promise<void> {
    this.ready ??= this.initCollection().catch((error) => {
      // Quên kết quả hỏng để lần gọi sau còn thử lại được.
      this.ready = undefined;

      throw error;
    });

    return this.ready;
  }

  private async initCollection(): Promise<void> {
    await this.qdrant.ensureCollection(this.collection, await this.embedding.getDimension());

    Logger.log(`Qdrant product index "${this.collection}" sẵn sàng`, ProductVectorService.name);
  }

  /**
   * Nạp lại toàn bộ sản phẩm vào index.
   * Tạo lại collection để index không giữ sản phẩm đã bị xoá hoặc ẩn.
   */
  async reindexAll(): Promise<{ indexed: number }> {
    const products = await this.productGrpc.listProductsForIndex(REINDEX_LIMIT);

    await this.qdrant.recreateCollection(this.collection, await this.embedding.getDimension());

    this.ready = Promise.resolve();

    if (!products.length) {
      return { indexed: 0 };
    }

    await this.upsertProducts(products);

    Logger.log(`Đã index ${products.length} sản phẩm`, ProductVectorService.name);

    return { indexed: products.length };
  }

  /**
   * Đồng bộ index cho một vài sản phẩm cụ thể — dùng sau khi admin tạo/sửa/ẩn
   * sản phẩm, thay vì nạp lại cả kho.
   *
   * Sản phẩm không còn bán (bị xoá, chuyển draft/archived) thì phải bị gỡ khỏi
   * index chứ không chỉ bỏ qua, nếu không nó vẫn hiện trong tìm kiếm ngữ nghĩa.
   */
  async indexProducts(productIds: string[]): Promise<{ indexed: string[]; removed: string[] }> {
    const indexed: string[] = [];
    const removed: string[] = [];
    const products: IndexableProduct[] = [];

    for (const productId of productIds) {
      const product = await this.productGrpc.getProductForIndex(productId);

      if (!product) {
        removed.push(productId);

        continue;
      }

      products.push(product);
      indexed.push(productId);
    }

    await this.upsertProducts(products);
    await this.qdrant.deleteByIds(this.collection, removed);

    return { indexed, removed };
  }

  /** Gỡ sản phẩm khỏi index — gọi khi sản phẩm bị xoá hoặc chuyển sang ẩn. */
  async removeProduct(productId: string): Promise<{ removed: string }> {
    await this.qdrant.deleteByIds(this.collection, [productId]);

    return { removed: productId };
  }

  async search(query: string, limit = 8): Promise<SemanticProduct[]> {
    if (!query.trim()) return [];

    await this.ensureReady();

    const vector = await this.embedding.embedQuery(query);

    const hits = await this.qdrant.search(this.collection, vector, { limit });

    return hits.map((hit) => ({ ...(hit.payload as ProductPayload), score: hit.score }));
  }

  /**
   * Sản phẩm tương tự: lấy lại chính vector đã lưu của sản phẩm rồi tìm hàng
   * xóm gần nhất, bỏ chính nó ra.
   */
  async similarTo(productId: string, limit = 8): Promise<SemanticProduct[]> {
    const vector = await this.qdrant.retrieveVector(this.collection, productId);

    if (!vector) return [];

    const hits = await this.qdrant.search(this.collection, vector, { limit: limit + 1 });

    return hits
      .filter((hit) => hit.id !== productId)
      .slice(0, limit)
      .map((hit) => ({ ...(hit.payload as ProductPayload), score: hit.score }));
  }

  async stats(): Promise<{ collection: string; indexed: number }> {
    return {
      collection: this.collection,
      indexed: await this.qdrant.countPoints(this.collection),
    };
  }

  private async upsertProducts(products: IndexableProduct[]): Promise<void> {
    if (!products.length) return;

    await this.ensureReady();

    const vectors = await this.embedding.embedDocuments(
      products.map((product) => this.buildEmbeddingText(product)),
    );

    const points: QdrantPoint[] = products.map((product, index) => ({
      id: product.productId,
      vector: vectors[index],
      payload: {
        productId: product.productId,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        price: product.price,
        brandName: product.brandName,
        categoryName: product.categoryName,
      } satisfies ProductPayload,
    }));

    await this.qdrant.upsert(this.collection, points);
  }

  private buildEmbeddingText(product: IndexableProduct): string {
    return [
      product.name,
      product.brandName,
      product.categoryName,
      product.shortDescription,
      product.description,
    ]
      .filter(Boolean)
      .join('\n');
  }
}
