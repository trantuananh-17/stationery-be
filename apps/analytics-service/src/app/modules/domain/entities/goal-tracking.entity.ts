import { randomUUID } from 'crypto';

export type GoalTrackingParams = {
  readonly id: string;

  readonly bucketMonth: string;

  revenueGoal: number;

  currentRevenue: number;

  ordersGoal: number;

  currentOrders: number;

  customersGoal: number;

  currentCustomers: number;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class GoalTracking {
  constructor(private params: GoalTrackingParams) {}

  static create(data: {
    bucketMonth: string;

    revenueGoal: number;

    ordersGoal: number;

    customersGoal: number;
  }): GoalTracking {
    const now = new Date();

    return new GoalTracking({
      id: randomUUID(),

      bucketMonth: data.bucketMonth,

      revenueGoal: data.revenueGoal,

      currentRevenue: 0,

      ordersGoal: data.ordersGoal,

      currentOrders: 0,

      customersGoal: data.customersGoal,

      currentCustomers: 0,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(params: GoalTrackingParams) {
    return new GoalTracking(params);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  applyOrderPaid(data: {
    revenue: number;

    orders: number;
  }) {
    if (data.revenue <= 0) {
      throw new Error('revenue must be greater than 0');
    }

    if (data.orders <= 0) {
      throw new Error('orders must be greater than 0');
    }

    this.params.currentRevenue += data.revenue;

    this.params.currentOrders += data.orders;

    this.setUpdatedAt();
  }

  applyCustomerCreated() {
    this.params.currentCustomers += 1;

    this.setUpdatedAt();
  }

  getRevenueProgress(): number {
    if (this.params.revenueGoal <= 0) {
      return 0;
    }

    return Math.min((this.params.currentRevenue / this.params.revenueGoal) * 100, 100);
  }

  getOrdersProgress(): number {
    if (this.params.ordersGoal <= 0) {
      return 0;
    }

    return Math.min((this.params.currentOrders / this.params.ordersGoal) * 100, 100);
  }

  getCustomersProgress(): number {
    if (this.params.customersGoal <= 0) {
      return 0;
    }

    return Math.min((this.params.currentCustomers / this.params.customersGoal) * 100, 100);
  }

  get id(): string {
    return this.params.id;
  }

  get bucketMonth(): string {
    return this.params.bucketMonth;
  }

  get revenueGoal(): number {
    return this.params.revenueGoal;
  }

  get currentRevenue(): number {
    return this.params.currentRevenue;
  }

  get ordersGoal(): number {
    return this.params.ordersGoal;
  }

  get currentOrders(): number {
    return this.params.currentOrders;
  }

  get customersGoal(): number {
    return this.params.customersGoal;
  }

  get currentCustomers(): number {
    return this.params.currentCustomers;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
