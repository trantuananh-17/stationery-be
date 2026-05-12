import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetOrderStatusSummaryQuery } from './get-order-status-summary.query';
import { IOrderStatusMetricQueryRepository } from '../../ports/queries/order-status-metric-query.repository';

@QueryHandler(GetOrderStatusSummaryQuery)
export class GetOrderStatusSummaryHandler implements IQueryHandler<GetOrderStatusSummaryQuery> {
  constructor(private readonly repository: IOrderStatusMetricQueryRepository) {}

  async execute(query: GetOrderStatusSummaryQuery) {
    return this.repository.getSummary(query.startDate, query.endDate);
  }
}
