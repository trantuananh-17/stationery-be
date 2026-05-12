import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetDailyMetricSummaryQuery } from './get-daily-metric-summary.query';
import { IDailyMetricQueryRepository } from '../../ports/queries/daily-metric-query.repository';

@QueryHandler(GetDailyMetricSummaryQuery)
export class GetDailyMetricSummaryHandler implements IQueryHandler<GetDailyMetricSummaryQuery> {
  constructor(private readonly repository: IDailyMetricQueryRepository) {}

  async execute(query: GetDailyMetricSummaryQuery) {
    return this.repository.getSummary(query.startDate, query.endDate);
  }
}
