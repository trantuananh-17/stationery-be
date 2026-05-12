import { randomUUID } from 'crypto';

export enum RecentTransactionStatus {
  PENDING = 'PENDING',

  PROCESSING = 'PROCESSING',

  SHIPPED = 'SHIPPED',

  DELIVERED = 'DELIVERED',

  CANCELLED = 'CANCELLED',
}

export type RecentTransactionParams = {
  readonly id: string;

  readonly orderId: string;

  customerId: string;

  customerName: string;

  totalAmount: number;

  totalItems: number;

  status: RecentTransactionStatus;

  orderedAt: Date;

  updatedAt: Date;
};

export class RecentTransaction {
  constructor(private params: RecentTransactionParams) {}

  static create(data: {
    orderId: string;

    customerId: string;

    customerName: string;

    totalAmount: number;

    totalItems: number;

    orderedAt: Date;
  }): RecentTransaction {
    return new RecentTransaction({
      id: randomUUID(),

      orderId: data.orderId,

      customerId: data.customerId,

      customerName: data.customerName,

      totalAmount: data.totalAmount,

      totalItems: data.totalItems,

      status: RecentTransactionStatus.PENDING,

      orderedAt: data.orderedAt,

      updatedAt: new Date(),
    });
  }

  static restore(params: RecentTransactionParams) {
    return new RecentTransaction(params);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  markProcessing() {
    this.params.status = RecentTransactionStatus.PROCESSING;

    this.setUpdatedAt();
  }

  markShipped() {
    this.params.status = RecentTransactionStatus.SHIPPED;

    this.setUpdatedAt();
  }

  markDelivered() {
    this.params.status = RecentTransactionStatus.DELIVERED;

    this.setUpdatedAt();
  }

  markCancelled() {
    this.params.status = RecentTransactionStatus.CANCELLED;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get orderId(): string {
    return this.params.orderId;
  }

  get customerId(): string {
    return this.params.customerId;
  }

  get customerName(): string {
    return this.params.customerName;
  }

  get totalAmount(): number {
    return this.params.totalAmount;
  }

  get totalItems(): number {
    return this.params.totalItems;
  }

  get status(): RecentTransactionStatus {
    return this.params.status;
  }

  get orderedAt(): Date {
    return this.params.orderedAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
