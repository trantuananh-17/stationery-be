import { randomUUID } from 'crypto';
import { StatusCart } from '../enums/status-cart.enum';
import { CartItem } from './cart-item.entity';

export type CartParams = {
  readonly id: string;
  readonly userId?: string;
  readonly sessionId?: string;
  status: StatusCart;
  currency: string;
  expiresAt?: Date;
  readonly createdAt: Date;
  updatedAt: Date;
};

type CreateCartParams = {
  userId?: string;
  sessionId?: string;
  currency: string;
  items?: CartItem[];
};

export class Cart {
  constructor(
    private params: CartParams,
    private cartItems: CartItem[] = [],
  ) {
    this.validate();
  }

  static create(data: CreateCartParams): Cart {
    if (!data.userId && !data.sessionId) {
      throw new Error('userId or sessionId is required');
    }

    if (!data.currency?.trim()) {
      throw new Error('currency is required');
    }

    const now = new Date();

    return new Cart(
      {
        id: randomUUID(),
        userId: data.userId,
        sessionId: data.sessionId,
        status: StatusCart.ACTIVE,
        currency: data.currency.trim().toUpperCase(),
        expiresAt: data.sessionId ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
        createdAt: now,
        updatedAt: now,
      },
      data.items ?? [],
    );
  }

  static restore(params: CartParams, items: CartItem[] = []): Cart {
    return new Cart(params, items);
  }

  private validate(): void {
    if (!this.params.userId && !this.params.sessionId) {
      throw new Error('userId or sessionId is required');
    }

    if (!this.params.currency?.trim()) {
      throw new Error('currency is required');
    }
  }

  private setUpdatedAt(): void {
    this.params.updatedAt = new Date();
  }

  addItem(item: CartItem): void {
    const existedItem = this.cartItems.find((cartItem) => {
      return cartItem.variantId === item.variantId;
    });

    if (existedItem) {
      existedItem.increaseQuantity(item.quantity);
    } else {
      this.cartItems.push(item);
    }

    this.setUpdatedAt();
  }

  removeItem(cartItemId: string): void {
    const index = this.cartItems.findIndex((item) => item.id === cartItemId);

    if (index === -1) {
      throw new Error('Cart item not found');
    }

    this.cartItems.splice(index, 1);
    this.setUpdatedAt();
  }

  updateItemQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    const item = this.cartItems.find((cartItem) => cartItem.id === cartItemId);

    if (!item) {
      throw new Error('Cart item not found');
    }

    item.changeQuantity(quantity);
    this.setUpdatedAt();
  }

  clear(): void {
    this.cartItems = [];
    this.setUpdatedAt();
  }

  expire(): void {
    this.params.status = StatusCart.EXPIRED;
    this.setUpdatedAt();
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    this.params.status = StatusCart.CHECK_OUT;
    this.setUpdatedAt();
  }

  mergeItems(items: CartItem[]): void {
    for (const item of items) {
      this.addItem(item);
    }
  }

  hasItems(): boolean {
    return this.cartItems.length > 0;
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  get id(): string {
    return this.params.id;
  }

  get userId(): string | undefined {
    return this.params.userId;
  }

  get sessionId(): string | undefined {
    return this.params.sessionId;
  }

  get status(): StatusCart {
    return this.params.status;
  }

  get currency(): string {
    return this.params.currency;
  }

  get expiresAt(): Date | undefined {
    return this.params.expiresAt;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get totalUniqueItems(): number {
    return this.cartItems.length;
  }
}
