import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import {
  AiPort,
  ProductIndexResultDto,
  ProductIndexStatsDto,
  SemanticProductDto,
} from '../../application/ports/ai.port';

/**
 * ai-service chỉ có HTTP (không dựng gRPC server), nên adapter này dùng axios.
 *
 * Đi qua BFF thay vì để FE gọi thẳng ai-service — giữ đúng quy tắc
 * "FE chỉ nói chuyện với BFF" (xem known-issues.md mục B).
 */
@Injectable()
export class AiHttpAdapter implements AiPort {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.AI_SERVICE_URL ?? 'http://localhost:3413/api/v1',
      timeout: Number(process.env.AI_SERVICE_TIMEOUT ?? 15000),
    });
  }

  async semanticSearch(query: string, limit = 8): Promise<SemanticProductDto[]> {
    return this.safeCall(async () => {
      const response = await this.client.post<{ items: SemanticProductDto[] }>(
        '/product-search/semantic',
        { query, limit },
      );

      return response.data?.items ?? [];
    });
  }

  async similarProducts(productId: string, limit = 8): Promise<SemanticProductDto[]> {
    return this.safeCall(async () => {
      const response = await this.client.get<{ items: SemanticProductDto[] }>(
        `/product-search/similar/${productId}`,
        { params: { limit } },
      );

      return response.data?.items ?? [];
    });
  }

  async reindexProducts(): Promise<{ indexed: number }> {
    const response = await this.client.post<{ indexed: number }>('/product-search/reindex');

    return response.data ?? { indexed: 0 };
  }

  /**
   * Các thao tác index là hành động chủ động của admin: hỏng thì phải báo lỗi,
   * không nuốt như đường đọc ở dưới.
   */
  async indexProducts(productIds: string[]): Promise<ProductIndexResultDto> {
    const response = await this.client.post<ProductIndexResultDto>('/product-search/index', {
      productIds,
    });

    return response.data ?? { indexed: [], removed: [] };
  }

  async removeProductFromIndex(productId: string): Promise<{ removed: string }> {
    const response = await this.client.delete<{ removed: string }>(
      `/product-search/index/${productId}`,
    );

    return response.data ?? { removed: productId };
  }

  async indexStats(): Promise<ProductIndexStatsDto> {
    const response = await this.client.get<ProductIndexStatsDto>('/product-search/stats');

    return response.data ?? { collection: '', indexed: 0 };
  }

  /**
   * ai-service phụ thuộc dịch vụ embedding bên ngoài; nó chết thì trang sản phẩm
   * vẫn phải xem được, nên phần gợi ý chỉ trả rỗng thay vì làm hỏng cả request.
   */
  private async safeCall(fn: () => Promise<SemanticProductDto[]>): Promise<SemanticProductDto[]> {
    try {
      return await fn();
    } catch (error) {
      Logger.warn(`ai-service không phản hồi: ${error}`, 'AiHttpAdapter');

      return [];
    }
  }
}
