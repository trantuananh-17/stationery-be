import { randomUUID } from 'crypto';
import { OrderItem, CreateOrderItemParams } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export type OrderAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
};

export type OrderParams = {
  readonly id: string;
  readonly number: string;
  readonly userId: string;
  status: OrderStatus;

  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;

  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paymentProvider?: string;

  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;

  notes?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: Date;

  readonly createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderParams = {
  userId: string;
  number: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: string;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  notes?: string;
  items: Omit<CreateOrderItemParams, 'orderId'>[];
};

export class Order {
  constructor(
    private params: OrderParams,
    private orderItems: OrderItem[] = [],
  ) {
    this.validate();
  }

  static create(data: CreateOrderParams): Order {
    if (!data.items?.length) {
      throw new Error('Order must have at least one item');
    }

    const now = new Date();
    const orderId = randomUUID();

    const items = data.items.map((item) =>
      OrderItem.create({
        ...item,
        orderId,
      }),
    );

    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    const tax = data.tax ?? 0;
    const shippingCost = data.shippingCost ?? 0;
    const discount = data.discount ?? 0;
    const total = subtotal + tax + shippingCost - discount;

    return new Order(
      {
        id: orderId,
        number: data.number,
        userId: data.userId,
        status: OrderStatus.PENDING,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
      },
      items,
    );
  }

  static restore(params: OrderParams, items: OrderItem[] = []): Order {
    return new Order(params, items);
  }

  private validateAddress(address: OrderAddress, name: string): void {
    if (!address.firstName?.trim()) {
      throw new Error(`${name}.firstName is required`);
    }

    if (!address.lastName?.trim()) {
      throw new Error(`${name}.lastName is required`);
    }

    if (!address.address1?.trim()) {
      throw new Error(`${name}.address1 is required`);
    }

    if (!address.city?.trim()) {
      throw new Error(`${name}.city is required`);
    }

    if (!address.state?.trim()) {
      throw new Error(`${name}.state is required`);
    }

    if (!address.zip?.trim()) {
      throw new Error(`${name}.zip is required`);
    }

    if (!address.country?.trim()) {
      throw new Error(`${name}.country is required`);
    }
  }

  private validate(): void {
    if (!this.params.id?.trim()) {
      throw new Error('id is required');
    }

    if (!this.params.number?.trim()) {
      throw new Error('number is required');
    }

    if (!this.params.userId?.trim()) {
      throw new Error('userId is required');
    }

    if (!this.params.paymentMethod?.trim()) {
      throw new Error('paymentMethod is required');
    }

    this.validateAddress(this.params.shippingAddress, 'shippingAddress');
    this.validateAddress(this.params.billingAddress, 'billingAddress');

    if (this.params.tax < 0) {
      throw new Error('tax must be greater than or equal to 0');
    }

    if (this.params.shippingCost < 0) {
      throw new Error('shippingCost must be greater than or equal to 0');
    }

    if (this.params.discount < 0) {
      throw new Error('discount must be greater than or equal to 0');
    }

    if (!this.orderItems.length) {
      throw new Error('Order must have at least one item');
    }

    const expectedSubtotal = this.orderItems.reduce((total, item) => total + item.subtotal, 0);

    if (this.params.subtotal !== expectedSubtotal) {
      throw new Error('subtotal is invalid');
    }

    const expectedTotal =
      this.params.subtotal + this.params.tax + this.params.shippingCost - this.params.discount;

    if (this.params.total !== expectedTotal) {
      throw new Error('total is invalid');
    }
  }

  private setUpdatedAt(): void {
    this.params.updatedAt = new Date();
  }

  markProcessing(): void {
    if (this.params.status !== OrderStatus.PENDING) {
      throw new Error('Only pending order can be moved to processing');
    }

    this.params.status = OrderStatus.PROCESSING;
    this.setUpdatedAt();
  }

  markShipped(trackingNumber?: string, shippingProvider?: string): void {
    if (this.params.status !== OrderStatus.PROCESSING) {
      throw new Error('Only processing order can be shipped');
    }

    this.params.status = OrderStatus.SHIPPED;
    this.params.trackingNumber = trackingNumber;
    this.params.shippingProvider = shippingProvider;
    this.setUpdatedAt();
  }

  markDelivered(): void {
    if (this.params.status !== OrderStatus.SHIPPED) {
      throw new Error('Only shipped order can be delivered');
    }

    this.params.status = OrderStatus.DELIVERED;
    this.setUpdatedAt();
  }

  cancel(): void {
    if (this.params.status === OrderStatus.DELIVERED) {
      throw new Error('Delivered order cannot be cancelled');
    }

    if (this.params.status === OrderStatus.CANCELLED) {
      throw new Error('Order already cancelled');
    }

    this.params.status = OrderStatus.CANCELLED;
    this.setUpdatedAt();
  }

  markPaid(transactionId?: string, provider?: string): void {
    this.params.paymentStatus = PaymentStatus.PAID;
    this.params.paymentTransactionId = transactionId;
    this.params.paymentProvider = provider;
    this.setUpdatedAt();
  }

  markPaymentFailed(transactionId?: string, provider?: string): void {
    this.params.paymentStatus = PaymentStatus.FAILED;
    this.params.paymentTransactionId = transactionId;
    this.params.paymentProvider = provider;
    this.setUpdatedAt();
  }

  refund(transactionId?: string): void {
    this.params.paymentStatus = PaymentStatus.REFUNDED;
    this.params.paymentTransactionId = transactionId;
    this.setUpdatedAt();
  }

  getItems(): OrderItem[] {
    return [...this.orderItems];
  }

  getItemById(orderItemId: string): OrderItem | undefined {
    return this.orderItems.find((item) => item.id === orderItemId);
  }

  get totalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  get totalUniqueItems(): number {
    return this.orderItems.length;
  }

  get id(): string {
    return this.params.id;
  }

  get number(): string {
    return this.params.number;
  }

  get userId(): string {
    return this.params.userId;
  }

  get status(): OrderStatus {
    return this.params.status;
  }

  get paymentStatus(): PaymentStatus {
    return this.params.paymentStatus;
  }

  get paymentMethod(): string {
    return this.params.paymentMethod;
  }

  get shippingAddress(): OrderAddress {
    return this.params.shippingAddress;
  }

  get billingAddress(): OrderAddress {
    return this.params.billingAddress;
  }

  get subtotal(): number {
    return this.params.subtotal;
  }

  get tax(): number {
    return this.params.tax;
  }

  get shippingCost(): number {
    return this.params.shippingCost;
  }

  get discount(): number {
    return this.params.discount;
  }

  get total(): number {
    return this.params.total;
  }

  get notes(): string | undefined {
    return this.params.notes;
  }

  get trackingNumber(): string | undefined {
    return this.params.trackingNumber;
  }

  get shippingProvider(): string | undefined {
    return this.params.shippingProvider;
  }

  get estimatedDelivery(): Date | undefined {
    return this.params.estimatedDelivery;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
