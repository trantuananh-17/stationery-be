import { IQuery } from '@nestjs/cqrs';

export class GetDailyMetricSummaryQuery implements IQuery {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
