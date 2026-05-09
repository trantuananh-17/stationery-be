import { randomUUID } from 'crypto';

export type CustomerSummaryParams = {
  readonly id: string;

  readonly userId: string;

  email: string;

  isActive: boolean;

  isVerified: boolean;

  totalOrders: number;

  amountSpent: number;

  lastOrderId?: string;

  lastOrderTotal?: number;

  lastOrderAt?: Date;

  readonly customerSince: Date;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class CustomerSummary {
  constructor(private params: CustomerSummaryParams) {}

  static create(userId: string, email: string) {
    const now = new Date();

    return new CustomerSummary({
      id: randomUUID(),

      userId,

      email,

      isActive: false,

      isVerified: false,

      totalOrders: 0,

      amountSpent: 0,

      customerSince: now,

      createdAt: now,

      updatedAt: now,
    });
  }

  private touch() {
    this.params.updatedAt = new Date();
  }

  updateEmail(email: string) {
    this.params.email = email;

    this.touch();
  }

  updateIsActive(isActive: boolean) {
    this.params.isActive = isActive;

    this.touch();
  }

  updateIsVerified(isVerified: boolean) {
    this.params.isVerified = isVerified;

    this.touch();
  }

  increaseTotalOrders(value: number) {
    this.params.totalOrders += value;

    this.touch();
  }

  increaseAmountSpent(value: number) {
    this.params.amountSpent += value;

    this.touch();
  }

  updateLastOrder(orderId: string, total?: number, orderedAt?: Date) {
    this.params.lastOrderId = orderId;

    if (total !== undefined) {
      this.params.lastOrderTotal = total;
    }

    if (orderedAt !== undefined) {
      this.params.lastOrderAt = orderedAt;
    }

    this.touch();
  }

  updateAuthStatus(payload: { isActive?: boolean; isVerified?: boolean }) {
    if (payload.isActive !== undefined) {
      this.params.isActive = payload.isActive;
    }

    if (payload.isVerified !== undefined) {
      this.params.isVerified = payload.isVerified;
    }

    this.touch();
  }

  applyOrder(payload: { orderId: string; totalPrice: number; orderedAt: Date }) {
    this.params.totalOrders += 1;

    this.params.amountSpent += payload.totalPrice;

    this.params.lastOrderId = payload.orderId;

    this.params.lastOrderTotal = payload.totalPrice;

    this.params.lastOrderAt = payload.orderedAt;

    this.touch();
  }

  get id() {
    return this.params.id;
  }

  get userId() {
    return this.params.userId;
  }

  get email() {
    return this.params.email;
  }

  get isActive() {
    return this.params.isActive;
  }

  get isVerified() {
    return this.params.isVerified;
  }

  get totalOrders() {
    return this.params.totalOrders;
  }

  get amountSpent() {
    return this.params.amountSpent;
  }

  get lastOrderId() {
    return this.params.lastOrderId;
  }

  get lastOrderTotal() {
    return this.params.lastOrderTotal;
  }

  get lastOrderAt() {
    return this.params.lastOrderAt;
  }

  get customerSince() {
    return this.params.customerSince;
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }
}
