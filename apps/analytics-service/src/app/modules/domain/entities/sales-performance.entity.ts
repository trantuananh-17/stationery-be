import { randomUUID } from 'crypto';

export type SalesPerformanceParams = {
  readonly id: string;

  readonly bucketDate: string;

  revenue: number;

  orders: number;

  estimatedProfit: number;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class SalesPerformance {
  constructor(private params: SalesPerformanceParams) {}

  static create(bucketDate: string): SalesPerformance {
    const now = new Date();

    return new SalesPerformance({
      id: randomUUID(),

      bucketDate,

      revenue: 0,

      orders: 0,

      estimatedProfit: 0,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(params: SalesPerformanceParams): SalesPerformance {
    return new SalesPerformance(params);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  applyOrderPaid(data: {
    revenue: number;

    orders: number;

    estimatedProfit: number;
  }) {
    if (data.revenue <= 0) {
      throw new Error('revenue must be greater than 0');
    }

    if (data.orders <= 0) {
      throw new Error('orders must be greater than 0');
    }

    this.params.revenue += data.revenue;

    this.params.orders += data.orders;

    this.params.estimatedProfit += data.estimatedProfit;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get bucketDate(): string {
    return this.params.bucketDate;
  }

  get revenue(): number {
    return this.params.revenue;
  }

  get orders(): number {
    return this.params.orders;
  }

  get estimatedProfit(): number {
    return this.params.estimatedProfit;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
