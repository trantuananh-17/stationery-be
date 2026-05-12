import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetDailyMetricGrowthQuery } from './get-daily-metric-growth.query';
import { IDailyMetricQueryRepository } from '../../ports/queries/daily-metric-query.repository';

@QueryHandler(GetDailyMetricGrowthQuery)
export class GetDailyMetricGrowthHandler implements IQueryHandler<GetDailyMetricGrowthQuery> {
  constructor(private readonly repository: IDailyMetricQueryRepository) {}

  async execute(query: GetDailyMetricGrowthQuery) {
    return this.repository.getGrowth(
      query.currentStartDate,
      query.currentEndDate,

      query.previousStartDate,
      query.previousEndDate,
    );
  }
}
