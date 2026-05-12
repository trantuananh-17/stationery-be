import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetCategoryRevenueQuery } from './get-category-revenue.query';
import { ICategoryPerformanceQueryRepository } from '../../ports/queries/category-performance-query.repository';

@QueryHandler(GetCategoryRevenueQuery)
export class GetCategoryRevenueHandler implements IQueryHandler<GetCategoryRevenueQuery> {
  constructor(private readonly repository: ICategoryPerformanceQueryRepository) {}

  async execute(query: GetCategoryRevenueQuery) {
    return this.repository.getRevenueByCategory(query.startDate, query.endDate);
  }
}
