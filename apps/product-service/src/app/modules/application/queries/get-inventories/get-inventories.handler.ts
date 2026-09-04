import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InventoryItemReadModel } from '../../read-models/inventory-item.read-model';
import { IInventoryQueryRepository } from '../../ports/repositories/inventory-query.repo';
import { GetInventoriesQuery } from './get-inventories.query';

export type GetInventoriesResult = PaginatedResult<InventoryItemReadModel>;

@QueryHandler(GetInventoriesQuery)
export class GetInventoriesHandler
  implements IQueryHandler<GetInventoriesQuery, GetInventoriesResult>
{
  constructor(private readonly inventoryRepo: IInventoryQueryRepository) {}

  async execute(query: GetInventoriesQuery): Promise<GetInventoriesResult> {
    const { search, lowStockThreshold, page, limit } = query;

    const keywords = search?.trim() ? search.trim().split(/\s+/).filter(Boolean) : [];

    const result = await this.inventoryRepo.findAll({
      keywords,
      lowStockThreshold,
      page,
      limit,
    });

    return {
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
