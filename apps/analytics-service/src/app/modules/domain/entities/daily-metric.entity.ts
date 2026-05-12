import { randomUUID } from 'crypto';

export type DailyMetricParams = {
  readonly id: string;

  readonly date: string;

  totalRevenue: number;

  totalOrders: number;

  newCustomers: number;

  averageOrderValue: number;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class DailyMetric {
  constructor(private params: DailyMetricParams) {}

  static create(date: string): DailyMetric {
    const now = new Date();

    return new DailyMetric({
      id: randomUUID(),

      date,

      totalRevenue: 0,

      totalOrders: 0,

      newCustomers: 0,

      averageOrderValue: 0,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(params: DailyMetricParams): DailyMetric {
    return new DailyMetric(params);
  }

  private setUpdatedAt(): void {
    this.params.updatedAt = new Date();
  }

  private recalculateAverageOrderValue(): void {
    if (this.params.totalOrders <= 0) {
      this.params.averageOrderValue = 0;

      return;
    }

    this.params.averageOrderValue = this.params.totalRevenue / this.params.totalOrders;
  }

  applyOrderPaid(data: { totalAmount: number }): void {
    if (data.totalAmount <= 0) {
      throw new Error('totalAmount must be greater than 0');
    }

    this.params.totalRevenue += data.totalAmount;

    this.params.totalOrders += 1;

    this.recalculateAverageOrderValue();

    this.setUpdatedAt();
  }

  applyCustomerCreated(): void {
    this.params.newCustomers += 1;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get date(): string {
    return this.params.date;
  }

  get totalRevenue(): number {
    return this.params.totalRevenue;
  }

  get totalOrders(): number {
    return this.params.totalOrders;
  }

  get newCustomers(): number {
    return this.params.newCustomers;
  }

  get averageOrderValue(): number {
    return this.params.averageOrderValue;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
