import { randomUUID } from 'crypto';

export type LastOrderItemAttribute = {
  name: string;
  value: string;
};

export type LastOrderItem = {
  productId: string;

  variantId?: string;

  name: string;

  sku?: string;

  thumbnail?: string;

  quantity: number;

  price: number;

  subtotal: number;

  attributes: LastOrderItemAttribute[];
};

export type LastOrderParams = {
  readonly id: string;

  readonly userId: string;

  orderId: string;

  orderNumber: string;

  totalPrice: number;

  orderStatus: string;

  paymentStatus: string;

  orderedAt: Date;

  items: LastOrderItem[];

  readonly createdAt: Date;

  updatedAt: Date;
};

export class LastOrder {
  constructor(private params: LastOrderParams) {}

  static create(payload: {
    userId: string;

    orderId: string;

    orderNumber: string;

    totalPrice: number;

    orderStatus: string;

    paymentStatus: string;

    orderedAt: Date;

    items: LastOrderItem[];
  }) {
    const now = new Date();

    return new LastOrder({
      id: randomUUID(),

      userId: payload.userId,

      orderId: payload.orderId,

      orderNumber: payload.orderNumber,

      totalPrice: payload.totalPrice,

      orderStatus: payload.orderStatus,

      paymentStatus: payload.paymentStatus,

      orderedAt: payload.orderedAt,

      items: payload.items,

      createdAt: now,

      updatedAt: now,
    });
  }

  replace(params: {
    orderId: string;

    orderNumber: string;

    totalPrice: number;

    orderStatus: string;

    paymentStatus: string;

    orderedAt: Date;

    items: LastOrderItem[];
  }) {
    this.params.orderId = params.orderId;

    this.params.orderNumber = params.orderNumber;

    this.params.totalPrice = params.totalPrice;

    this.params.orderStatus = params.orderStatus;

    this.params.paymentStatus = params.paymentStatus;

    this.params.orderedAt = params.orderedAt;

    this.params.items = params.items;

    this.params.updatedAt = new Date();
  }

  get id() {
    return this.params.id;
  }

  get userId() {
    return this.params.userId;
  }

  get orderId() {
    return this.params.orderId;
  }

  get orderNumber() {
    return this.params.orderNumber;
  }

  get totalPrice() {
    return this.params.totalPrice;
  }

  get orderStatus() {
    return this.params.orderStatus;
  }

  get paymentStatus() {
    return this.params.paymentStatus;
  }

  get orderedAt() {
    return this.params.orderedAt;
  }

  get items() {
    return [...this.params.items];
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }
}
