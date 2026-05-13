import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetTopProductsQuery } from './get-top-products.query';
import { IProductPerformanceQueryRepository } from '../../ports/queries/product-performance-query.repository';

@QueryHandler(GetTopProductsQuery)
export class GetTopProductsHandler implements IQueryHandler<GetTopProductsQuery> {
  constructor(private readonly repository: IProductPerformanceQueryRepository) {}

  async execute(query: GetTopProductsQuery) {
    const products = await this.repository.getTopProducts(
      query.startDate,
      query.endDate,
      query.limit,
    );

    return {
      data: products,
    };
  }
}
