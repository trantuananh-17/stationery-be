import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSalesPerformanceChartQuery } from './get-sales-performance-chart.query';
import { ISalesPerformanceQueryRepository } from '../../ports/queries/sales-performance-query.repository';
import { toTimestamp } from '@common/utils/common.util';

@QueryHandler(GetSalesPerformanceChartQuery)
export class GetSalesPerformanceChartHandler
  implements IQueryHandler<GetSalesPerformanceChartQuery>
{
  constructor(private readonly repository: ISalesPerformanceQueryRepository) {}

  async execute(query: GetSalesPerformanceChartQuery) {
    const results = await this.repository.getChart(query.startDate, query.endDate);

    return {
      data: results.map((result) => ({
        date: toTimestamp(result.date),
        revenue: result.revenue,
        orders: result.orders,
        estimatedProfit: result.estimatedProfit,
      })),
    };
  }
}
