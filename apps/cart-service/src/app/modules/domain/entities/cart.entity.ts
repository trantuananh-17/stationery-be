import { randomUUID } from 'crypto';
import { StatusCart } from '../enums/status-cart.enum';
import {
  CartItem,
  CartItemAttributeSnapshot,
  UpdateCartItemSnapshotParams,
} from './cart-item.entity';

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

export type AddCartItemParams = {
  productId: string;
  variantId: string;
  quantity: number;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot?: string;
  productThumbnailSnapshot?: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  attributesSnapshot: CartItemAttributeSnapshot[];
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
    if (!this.params.id?.trim()) {
      throw new Error('id is required');
    }

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

  private ensureCanModify(): void {
    if (this.params.status !== StatusCart.ACTIVE) {
      throw new Error('Cart is not active');
    }
  }

  addItem(data: AddCartItemParams): void {
    this.ensureCanModify();

    const existedItem = this.cartItems.find((cartItem) => cartItem.variantId === data.variantId);

    if (existedItem) {
      existedItem.increaseQuantity(data.quantity);
    } else {
      const item = CartItem.create({
        cartId: this.id,
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
        productNameSnapshot: data.productNameSnapshot,
        productSlugSnapshot: data.productSlugSnapshot,
        variantNameSnapshot: data.variantNameSnapshot,
        skuSnapshot: data.skuSnapshot,
        productThumbnailSnapshot: data.productThumbnailSnapshot,
        imageVariantSnapshot: data.imageVariantSnapshot,
        unitPriceSnapshot: data.unitPriceSnapshot,
        compareAtPriceSnapshot: data.compareAtPriceSnapshot,
        attributesSnapshot: data.attributesSnapshot,
      });

      this.cartItems.push(item);
    }

    this.setUpdatedAt();
  }

  removeItem(cartItemId: string): void {
    this.ensureCanModify();

    const index = this.cartItems.findIndex((item) => item.id === cartItemId);

    if (index === -1) {
      throw new Error('Cart item not found');
    }

    this.cartItems.splice(index, 1);
    this.setUpdatedAt();
  }

  updateItemQuantity(cartItemId: string, quantity: number): void {
    this.ensureCanModify();

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

  updateItemSnapshot(cartItemId: string, snapshot: UpdateCartItemSnapshotParams): void {
    this.ensureCanModify();

    const item = this.cartItems.find((cartItem) => cartItem.id === cartItemId);

    if (!item) {
      throw new Error('Cart item not found');
    }

    item.updateSnapshot(snapshot);
    this.setUpdatedAt();
  }

  clear(): void {
    this.ensureCanModify();

    this.cartItems = [];
    this.setUpdatedAt();
  }

  expire(): void {
    if (this.params.status === StatusCart.CHECK_OUT) {
      throw new Error('Checked out cart cannot be expired');
    }

    this.params.status = StatusCart.EXPIRED;
    this.setUpdatedAt();
  }

  checkout(): void {
    if (this.params.status !== StatusCart.ACTIVE) {
      throw new Error('Cart is not active');
    }

    if (this.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    this.params.status = StatusCart.CHECK_OUT;
    this.setUpdatedAt();
  }

  mergeItems(items: AddCartItemParams[]): void {
    this.ensureCanModify();

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

  getItemById(cartItemId: string): CartItem | undefined {
    return this.cartItems.find((item) => item.id === cartItemId);
  }

  getItemByVariantId(variantId: string): CartItem | undefined {
    return this.cartItems.find((item) => item.variantId === variantId);
  }

  get subtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.subtotal, 0);
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
