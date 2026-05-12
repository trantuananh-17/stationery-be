export enum SalesPerformanceAction {
  ORDER_PAID = 'ORDER_PAID',

  ORDER_CANCELLED = 'ORDER_CANCELLED',
}

export class SalesPerformanceCommand {
  constructor(
    public readonly type: SalesPerformanceAction,

    public readonly date: string,

    public readonly totalRevenue?: number,

    public readonly totalOrders?: number,

    public readonly estimatedProfit?: number,
  ) {}
}
