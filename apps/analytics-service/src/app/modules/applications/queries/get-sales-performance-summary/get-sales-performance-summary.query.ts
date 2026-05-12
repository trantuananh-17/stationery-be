export class GetSalesPerformanceSummaryQuery {
  constructor(
    public readonly startDate: string,

    public readonly endDate: string,
  ) {}
}
