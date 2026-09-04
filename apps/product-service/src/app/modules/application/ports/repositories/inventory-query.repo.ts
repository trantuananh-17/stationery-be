import { QueryResult } from '@common/interfaces/common/pagination.interface';

import { InventoryItemReadModel } from '../../read-models/inventory-item.read-model';

export abstract class IInventoryQueryRepository {
  abstract findAll(filters: {
    keywords: string[];
    /** Chỉ lấy biến thể có tồn khả dụng (stock - reservedStock) <= ngưỡng. */
    lowStockThreshold?: number;
    page: number;
    limit: number;
  }): Promise<QueryResult<InventoryItemReadModel>>;
}
