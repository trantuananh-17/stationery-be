import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductPerformanceChartQuery } from './get-product-performance-chart.handler';
import { IProductPerformanceQueryRepository } from '../../ports/queries/product-performance-query.repository';

@QueryHandler(GetProductPerformanceChartQuery)
export class GetProductPerformanceChartHandler
  implements IQueryHandler<GetProductPerformanceChartQuery>
{
  constructor(private readonly repository: IProductPerformanceQueryRepository) {}

  async execute(query: GetProductPerformanceChartQuery) {
    return this.repository.getChart(
      query.productId,

      query.startDate,

      query.endDate,
    );
  }
}
