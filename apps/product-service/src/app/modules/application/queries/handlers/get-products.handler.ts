import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductQueryRepository } from '../../ports/product-query.repo';
import { GetProductsQuery } from '../get-products.query';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly repo: IProductQueryRepository) {}

  async execute(query: GetProductsQuery) {
    return this.repo.getAll(query.page, query.limit);
  }
}
