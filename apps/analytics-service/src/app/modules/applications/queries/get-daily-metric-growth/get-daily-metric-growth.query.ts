import { IQuery } from '@nestjs/cqrs';

export class GetDailyMetricGrowthQuery implements IQuery {
  constructor(
    public readonly currentStartDate: string,
    public readonly currentEndDate: string,

    public readonly previousStartDate: string,
    public readonly previousEndDate: string,
  ) {}
}
