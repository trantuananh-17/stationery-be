import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSalesPerformanceChartQuery } from './get-sales-performance-chart.query';
import { ISalesPerformanceQueryRepository } from '../../ports/queries/sales-performance-query.repository';

@QueryHandler(GetSalesPerformanceChartQuery)
export class GetSalesPerformanceChartHandler
  implements IQueryHandler<GetSalesPerformanceChartQuery>
{
  constructor(private readonly repository: ISalesPerformanceQueryRepository) {}

  async execute(query: GetSalesPerformanceChartQuery) {
    return this.repository.getChart(query.startDate, query.endDate);
  }
}
