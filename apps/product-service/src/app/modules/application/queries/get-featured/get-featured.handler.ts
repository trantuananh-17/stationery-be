import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { GetFeaturedQuery } from './get-featured.query';
import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { ProductReadModel } from '../../read-models/product.read-model';

@QueryHandler(GetFeaturedQuery)
export class GetFeaturedHandler implements IQueryHandler<GetFeaturedQuery> {
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetFeaturedQuery): Promise<PaginatedResult<ProductReadModel>> {
    const { page, limit } = query;

    const result = await this.productRepo.findFeaturedProducts(page, limit);

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
