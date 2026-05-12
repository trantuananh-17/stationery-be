export enum OrderStatusMetricAction {
  ORDER_CREATED = 'ORDER_CREATED',

  ORDER_PROCESSING = 'ORDER_PROCESSING',

  ORDER_SHIPPED = 'ORDER_SHIPPED',

  ORDER_DELIVERED = 'ORDER_DELIVERED',

  ORDER_CANCELLED = 'ORDER_CANCELLED',
}

export class OrderStatusMetricCommand {
  constructor(
    public readonly type: OrderStatusMetricAction,

    public readonly date: string,
  ) {}
}
