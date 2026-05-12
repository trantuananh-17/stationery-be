export class GetProductPerformanceChartQuery {
  constructor(
    public readonly productId: string,

    public readonly startDate: string,

    public readonly endDate: string,
  ) {}
}
