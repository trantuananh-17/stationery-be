import { IQuery } from '@nestjs/cqrs';

export class GetSalesPerformanceChartQuery implements IQuery {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
