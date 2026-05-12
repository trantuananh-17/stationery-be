import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetSalesPerformanceSummaryQuery } from './get-sales-performance-summary.query';
import { ISalesPerformanceQueryRepository } from '../../ports/queries/sales-performance-query.repository';

@QueryHandler(GetSalesPerformanceSummaryQuery)
export class GetSalesPerformanceSummaryHandler
  implements IQueryHandler<GetSalesPerformanceSummaryQuery>
{
  constructor(private readonly repository: ISalesPerformanceQueryRepository) {}

  async execute(query: GetSalesPerformanceSummaryQuery) {
    return this.repository.getSummary(query.startDate, query.endDate);
  }
}
