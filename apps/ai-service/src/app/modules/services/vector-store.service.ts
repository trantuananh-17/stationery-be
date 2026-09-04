import { randomUUID } from 'node:crypto';

import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IngestBodyDto } from '../dto/ingest.dto';
import { loadPdfAsDocuments } from '../helper/pdf.loader';
import { EmbeddingService } from './embedding.service';
import { QdrantPayload, QdrantPoint, QdrantService } from './qdrant.service';

const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 100;

/** Trần số chunk trả về khi liệt kê nguồn tài liệu đã nạp. */
const SOURCE_SCAN_LIMIT = 5000;

type DocumentPayload = QdrantPayload & { content: string; source: string };

/**
 * Kho tài liệu của chatbot (PDF chính sách, hướng dẫn...).
 *
 * Tách hẳn collection với index sản phẩm: trộn chung thì câu hỏi chính sách sẽ
 * lôi về mô tả sản phẩm và ngược lại.
 */
@Injectable()
export class VectorStoreService implements OnModuleInit {
  private readonly collection: string;

  private ready?: Promise<void>;

  constructor(
    private readonly configService: ConfigService,
    private readonly qdrant: QdrantService,
    private readonly embedding: EmbeddingService,
  ) {
    this.collection = this.configService.get<string>(
      'QDRANT_DOCS_COLLECTION',
      'chatbot_documents',
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
        VectorStoreService.name,
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
    await this.qdrant.ensurePayloadIndex(this.collection, 'source');

    Logger.log(`Qdrant document index "${this.collection}" sẵn sàng`, VectorStoreService.name);
  }

  async handleFileUpload(files: Express.Multer.File[]) {
    if (!files?.length) {
      return {
        success: false,
        message: 'No files uploaded',
      };
    }

    const results = [];

    for (const file of files) {
      const result = await this.insertPdfToVectorDb(file.path);

      results.push({
        file: file.originalname,
        ...result,
      });
    }

    return {
      success: true,
      files: results,
    };
  }

  async insertPdfToVectorDb(filePath: string) {
    const documents = await loadPdfAsDocuments(filePath);

    const chunks = await this.splitDocuments(documents);

    // Nạp lại cùng một file phải thay thế bản cũ, không cộng dồn chunk trùng.
    await this.removeSource(filePath);
    await this.addDocuments(chunks);

    return {
      success: true,
      chunksAdded: chunks.length,
    };
  }

  async ingest(body: IngestBodyDto) {
    const textDocs: Document[] = (body.docs || []).map(
      (doc) =>
        new Document({
          pageContent: doc.content,
          metadata: {
            source: doc.meta?.source ?? 'inline',
            ...doc.meta,
          },
        }),
    );

    const pdfDocs: Document[] = [];

    for (const pdfPath of body.pdfPaths || []) {
      const docs = await loadPdfAsDocuments(pdfPath);

      pdfDocs.push(...docs);
    }

    const allDocs = [...textDocs, ...pdfDocs];

    if (!allDocs.length) {
      return {
        success: false,
        message: 'No documents',
      };
    }

    const finalChunks = await this.splitDocuments(allDocs);

    await this.addDocuments(finalChunks);

    return {
      success: true,
      chunksAdded: finalChunks.length,
    };
  }

  /**
   * Qdrant trả về độ tương đồng cosine (càng cao càng gần), khác pgvector trả
   * khoảng cách — kết quả đã sắp sẵn giảm dần nên chỉ cần cắt bớt.
   */
  async similaritySearch(searchQuery: string, k = 8, limit = 4): Promise<Document[]> {
    if (!searchQuery?.trim()) return [];

    await this.ensureReady();

    const vector = await this.embedding.embedQuery(searchQuery);

    const hits = await this.qdrant.search(this.collection, vector, { limit: k });

    return hits.slice(0, limit).map((hit) => {
      const { content, ...metadata } = hit.payload as DocumentPayload;

      return new Document({
        pageContent: String(content ?? ''),
        metadata: { ...metadata, score: hit.score },
      });
    });
  }

  /** Gỡ toàn bộ chunk sinh ra từ một file/nguồn. */
  async removeSource(source: string): Promise<{ success: boolean; source: string }> {
    await this.qdrant.deleteByFilter(this.collection, {
      must: [{ key: 'source', match: { value: source } }],
    });

    return { success: true, source };
  }

  /** Danh sách nguồn đã nạp kèm số chunk — để biết cần nạp lại cái nào. */
  async listSources(): Promise<{ source: string; chunks: number }[]> {
    const payloads = await this.qdrant.scrollPayloads(this.collection, {
      limit: SOURCE_SCAN_LIMIT,
    });

    const counter = new Map<string, number>();

    for (const payload of payloads) {
      const source = String(payload.source ?? 'unknown');

      counter.set(source, (counter.get(source) ?? 0) + 1);
    }

    return [...counter.entries()]
      .map(([source, chunks]) => ({ source, chunks }))
      .sort((a, b) => b.chunks - a.chunks);
  }

  async stats(): Promise<{ collection: string; chunks: number }> {
    return {
      collection: this.collection,
      chunks: await this.qdrant.countPoints(this.collection),
    };
  }

  private splitDocuments(documents: Document[]): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });

    return splitter.splitDocuments(documents);
  }

  private async addDocuments(chunks: Document[]): Promise<void> {
    if (!chunks.length) return;

    await this.ensureReady();

    const vectors = await this.embedding.embedDocuments(chunks.map((chunk) => chunk.pageContent));

    const points: QdrantPoint[] = chunks.map((chunk, index) => ({
      id: randomUUID(),
      vector: vectors[index],
      payload: {
        ...chunk.metadata,
        content: chunk.pageContent,
        source: String(chunk.metadata?.source ?? 'inline'),
      },
    }));

    await this.qdrant.upsert(this.collection, points);
  }
}
