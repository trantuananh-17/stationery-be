export enum DailyMetricAction {
  ORDER_PAID = 'ORDER_PAID',

  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
}

export class DailyMetricCommand {
  constructor(
    public readonly type: DailyMetricAction,

    public readonly date: string,

    public readonly totalAmount?: number,
  ) {}
}
