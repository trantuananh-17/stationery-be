import { randomUUID } from 'crypto';

export type OrderItemAttributeSnapshot = {
  name: string;
  value: string;
};

export type OrderItemParams = {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly variantId?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  attributes: OrderItemAttributeSnapshot[];
  readonly createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderItemParams = {
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: OrderItemAttributeSnapshot[];
};

export class OrderItem {
  constructor(private params: OrderItemParams) {
    this.validate();
  }

  static create(data: CreateOrderItemParams): OrderItem {
    const now = new Date();
    const subtotal = data.price * data.quantity;

    return new OrderItem({
      id: randomUUID(),
      orderId: data.orderId,
      productId: data.productId,
      variantId: data.variantId,
      name: data.name,
      sku: data.sku,
      price: data.price,
      quantity: data.quantity,
      subtotal,
      image: data.image,
      attributes: data.attributes ?? [],
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: OrderItemParams): OrderItem {
    return new OrderItem(params);
  }

  private validate(): void {
    if (!this.params.id?.trim()) {
      throw new Error('id is required');
    }

    if (!this.params.orderId?.trim()) {
      throw new Error('orderId is required');
    }

    if (!this.params.productId?.trim()) {
      throw new Error('productId is required');
    }

    if (!this.params.name?.trim()) {
      throw new Error('name is required');
    }

    if (this.params.price < 0) {
      throw new Error('price must be greater than or equal to 0');
    }

    if (this.params.quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    if (!Array.isArray(this.params.attributes)) {
      throw new Error('attributes must be an array');
    }

    for (const attribute of this.params.attributes) {
      if (!attribute.name?.trim()) {
        throw new Error('attribute name is required');
      }

      if (!attribute.value?.trim()) {
        throw new Error('attribute value is required');
      }
    }

    const expectedSubtotal = this.params.price * this.params.quantity;
    if (this.params.subtotal !== expectedSubtotal) {
      throw new Error('subtotal is invalid');
    }
  }

  private setUpdatedAt(): void {
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get orderId(): string {
    return this.params.orderId;
  }

  get productId(): string {
    return this.params.productId;
  }

  get variantId(): string | undefined {
    return this.params.variantId;
  }

  get name(): string {
    return this.params.name;
  }

  get sku(): string | undefined {
    return this.params.sku;
  }

  get price(): number {
    return this.params.price;
  }

  get quantity(): number {
    return this.params.quantity;
  }

  get subtotal(): number {
    return this.params.subtotal;
  }

  get image(): string | undefined {
    return this.params.image;
  }

  get attributes(): OrderItemAttributeSnapshot[] {
    return [...this.params.attributes];
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
