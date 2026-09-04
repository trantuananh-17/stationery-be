import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { QdrantClient, Schemas } from '@qdrant/js-client-rest' with {
  'resolution-mode': 'import',
};

export type QdrantFilter = Schemas['Filter'];

export type QdrantPayload = Record<string, unknown>;

export type QdrantPoint = {
  id: string;
  vector: number[];
  payload: QdrantPayload;
};

export type QdrantHit = {
  id: string;
  score: number;
  payload: QdrantPayload;
};

/**
 * `@qdrant/js-client-rest` chỉ khai type cho nhánh ESM, còn service này biên
 * dịch ra CommonJS — nạp động để lấy đúng bản CJS mà TypeScript vẫn hiểu type.
 */
type QdrantModule = typeof import('@qdrant/js-client-rest', {
  with: { 'resolution-mode': 'import' },
});

let qdrantModule: Promise<QdrantModule> | undefined;

const loadQdrant = (): Promise<QdrantModule> => {
  qdrantModule ??= import('@qdrant/js-client-rest');

  return qdrantModule;
};

/**
 * Bọc Qdrant REST client cho toàn bộ ai-service.
 *
 * Mỗi collection chốt số chiều vector ngay lúc tạo, nên phải `ensureCollection`
 * trước lần ghi đầu tiên — Qdrant không tự suy ra như pgvector.
 */
@Injectable()
export class QdrantService {
  private clientPromise?: Promise<QdrantClient>;

  private readonly ensuredCollections = new Set<string>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Dựng lười thay vì trong `onModuleInit`: các service khác gọi Qdrant ngay ở
   * hook khởi động của chúng, mà Nest không bảo đảm thứ tự giữa các hook.
   */
  private getClient(): Promise<QdrantClient> {
    this.clientPromise ??= loadQdrant().then(({ QdrantClient }) => {
      const apiKey = this.configService.get<string>('QDRANT_API_KEY');

      return new QdrantClient({
        url: this.configService.get<string>('QDRANT_URL', 'http://localhost:6333'),
        apiKey: apiKey || undefined,
        // Qdrant trong docker thường mới hơn client; cảnh báo lệch bản không
        // đáng để ồn trong log mỗi lần khởi động.
        checkCompatibility: false,
      });
    });

    return this.clientPromise;
  }

  async ensureCollection(collection: string, vectorSize: number): Promise<void> {
    if (this.ensuredCollections.has(collection)) return;

    const client = await this.getClient();

    const { exists } = await client.collectionExists(collection);

    if (!exists) {
      await client.createCollection(collection, {
        vectors: { size: vectorSize, distance: 'Cosine' },
      });

      Logger.log(`Đã tạo collection "${collection}" (${vectorSize} chiều)`, QdrantService.name);
    }

    this.ensuredCollections.add(collection);
  }

  /** Xoá sạch rồi tạo lại — dùng khi index lại toàn bộ. */
  async recreateCollection(collection: string, vectorSize: number): Promise<void> {
    const client = await this.getClient();

    const { exists } = await client.collectionExists(collection);

    if (exists) {
      await client.deleteCollection(collection);
    }

    this.ensuredCollections.delete(collection);

    await this.ensureCollection(collection, vectorSize);
  }

  /**
   * Qdrant lọc được payload chưa đánh index nhưng chậm dần theo số điểm — khai
   * index cho field nào thực sự đem ra lọc.
   */
  async ensurePayloadIndex(collection: string, field: string): Promise<void> {
    const client = await this.getClient();

    try {
      await client.createPayloadIndex(collection, {
        field_name: field,
        field_schema: 'keyword',
        wait: true,
      });
    } catch (error) {
      // Index đã tồn tại là trạng thái hợp lệ, không phải lỗi.
      Logger.debug(`Bỏ qua tạo index "${field}": ${error}`, QdrantService.name);
    }
  }

  async upsert(collection: string, points: QdrantPoint[]): Promise<void> {
    if (!points.length) return;

    const client = await this.getClient();

    await client.upsert(collection, { wait: true, points });
  }

  async search(
    collection: string,
    vector: number[],
    options: { limit: number; filter?: QdrantFilter },
  ): Promise<QdrantHit[]> {
    const client = await this.getClient();

    const { points } = await client.query(collection, {
      query: vector,
      limit: options.limit,
      filter: options.filter,
      with_payload: true,
    });

    return points.map((point) => ({
      id: String(point.id),
      score: point.score,
      payload: (point.payload ?? {}) as QdrantPayload,
    }));
  }

  /** Lấy đúng một điểm kèm vector — dùng để tìm sản phẩm tương tự. */
  async retrieveVector(collection: string, id: string): Promise<number[] | null> {
    const client = await this.getClient();

    const { exists } = await client.collectionExists(collection);

    if (!exists) return null;

    const points = await client.retrieve(collection, {
      ids: [id],
      with_vector: true,
      with_payload: false,
    });

    const vector = points[0]?.vector;

    return Array.isArray(vector) ? (vector as number[]) : null;
  }

  async deleteByIds(collection: string, ids: string[]): Promise<void> {
    if (!ids.length) return;

    const client = await this.getClient();

    if (!(await client.collectionExists(collection)).exists) return;

    await client.delete(collection, { wait: true, points: ids });
  }

  async deleteByFilter(collection: string, filter: QdrantFilter): Promise<void> {
    const client = await this.getClient();

    if (!(await client.collectionExists(collection)).exists) return;

    await client.delete(collection, { wait: true, filter });
  }

  async countPoints(collection: string, filter?: QdrantFilter): Promise<number> {
    const client = await this.getClient();

    const { exists } = await client.collectionExists(collection);

    if (!exists) return 0;

    const { count } = await client.count(collection, { filter, exact: true });

    return count;
  }

  /** Duyệt payload theo trang — dùng để liệt kê nguồn tài liệu đã nạp. */
  async scrollPayloads(
    collection: string,
    options: { limit: number; filter?: QdrantFilter },
  ): Promise<QdrantPayload[]> {
    const client = await this.getClient();

    const { exists } = await client.collectionExists(collection);

    if (!exists) return [];

    const payloads: QdrantPayload[] = [];

    let offset: Schemas['ScrollRequest']['offset'];

    do {
      const page = await client.scroll(collection, {
        limit: Math.min(options.limit, 256),
        filter: options.filter,
        with_payload: true,
        with_vector: false,
        offset,
      });

      payloads.push(...page.points.map((point) => (point.payload ?? {}) as QdrantPayload));

      offset = page.next_page_offset ?? undefined;
    } while (offset !== undefined && payloads.length < options.limit);

    return payloads.slice(0, options.limit);
  }
}
