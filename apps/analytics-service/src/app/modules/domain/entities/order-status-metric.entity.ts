import { randomUUID } from 'crypto';

export type OrderStatusMetricParams = {
  readonly id: string;

  readonly bucketDate: string;

  pendingOrders: number;

  processingOrders: number;

  shippedOrders: number;

  deliveredOrders: number;

  cancelledOrders: number;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class OrderStatusMetric {
  constructor(private params: OrderStatusMetricParams) {}

  static create(bucketDate: string): OrderStatusMetric {
    const now = new Date();

    return new OrderStatusMetric({
      id: randomUUID(),

      bucketDate,

      pendingOrders: 0,

      processingOrders: 0,

      shippedOrders: 0,

      deliveredOrders: 0,

      cancelledOrders: 0,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(params: OrderStatusMetricParams) {
    return new OrderStatusMetric(params);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  increasePending() {
    this.params.pendingOrders += 1;

    this.setUpdatedAt();
  }

  movePendingToProcessing() {
    if (this.params.pendingOrders > 0) {
      this.params.pendingOrders -= 1;
    }

    this.params.processingOrders += 1;

    this.setUpdatedAt();
  }

  moveProcessingToShipped() {
    if (this.params.processingOrders > 0) {
      this.params.processingOrders -= 1;
    }

    this.params.shippedOrders += 1;

    this.setUpdatedAt();
  }

  moveShippedToDelivered() {
    if (this.params.shippedOrders > 0) {
      this.params.shippedOrders -= 1;
    }

    this.params.deliveredOrders += 1;

    this.setUpdatedAt();
  }

  increaseCancelled() {
    this.params.cancelledOrders += 1;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get bucketDate(): string {
    return this.params.bucketDate;
  }

  get pendingOrders(): number {
    return this.params.pendingOrders;
  }

  get processingOrders(): number {
    return this.params.processingOrders;
  }

  get shippedOrders(): number {
    return this.params.shippedOrders;
  }

  get deliveredOrders(): number {
    return this.params.deliveredOrders;
  }

  get cancelledOrders(): number {
    return this.params.cancelledOrders;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
