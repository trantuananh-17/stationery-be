export class GetOrderStatusSummaryQuery {
  constructor(
    public readonly startDate: string,

    public readonly endDate: string,
  ) {}
}
