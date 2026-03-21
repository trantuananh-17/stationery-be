import { randomUUID } from 'crypto';

export type CartItemParams = {
  readonly id: string;
  readonly cartId: string;
  readonly productId: string;
  readonly variantId: string;
  quantity: number;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot?: string;
  imageSnapshot?: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  readonly createdAt: Date;
  updatedAt: Date;
};

type CreateCartItemParams = {
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot?: string;
  imageSnapshot?: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
};

export class CartItem {
  constructor(private params: CartItemParams) {
    this.validate();
  }

  static create(data: CreateCartItemParams): CartItem {
    const now = new Date();

    return new CartItem({
      id: randomUUID(),
      cartId: data.cartId,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
      productNameSnapshot: data.productNameSnapshot,
      variantNameSnapshot: data.variantNameSnapshot,
      skuSnapshot: data.skuSnapshot,
      imageSnapshot: data.imageSnapshot,
      imageVariantSnapshot: data.imageVariantSnapshot,
      unitPriceSnapshot: data.unitPriceSnapshot,
      compareAtPriceSnapshot: data.compareAtPriceSnapshot,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: CartItemParams): CartItem {
    return new CartItem(params);
  }

  private validate(): void {
    if (!this.params.cartId?.trim()) {
      throw new Error('cartId is required');
    }

    if (!this.params.productId?.trim()) {
      throw new Error('productId is required');
    }

    if (!this.params.variantId?.trim()) {
      throw new Error('variantId is required');
    }

    if (!this.params.productNameSnapshot?.trim()) {
      throw new Error('productNameSnapshot is required');
    }

    if (!this.params.variantNameSnapshot?.trim()) {
      throw new Error('variantNameSnapshot is required');
    }

    if (this.params.quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    if (this.params.unitPriceSnapshot < 0) {
      throw new Error('unitPriceSnapshot must be greater than or equal to 0');
    }

    if (
      this.params.compareAtPriceSnapshot !== undefined &&
      this.params.compareAtPriceSnapshot < 0
    ) {
      throw new Error('compareAtPriceSnapshot must be greater than or equal to 0');
    }
  }

  private touch(): void {
    this.params.updatedAt = new Date();
  }

  changeQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    this.params.quantity = quantity;
    this.touch();
  }

  increaseQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    this.params.quantity += quantity;
    this.touch();
  }

  decreaseQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    const nextQuantity = this.params.quantity - quantity;

    if (nextQuantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    this.params.quantity = nextQuantity;
    this.touch();
  }

  updateSnapshots(data: {
    productNameSnapshot: string;
    variantNameSnapshot: string;
    skuSnapshot?: string;
    imageSnapshot?: string;
    imageVariantSnapshot?: string;
    unitPriceSnapshot: number;
    compareAtPriceSnapshot?: number;
  }): void {
    if (!data.productNameSnapshot?.trim()) {
      throw new Error('productNameSnapshot is required');
    }

    if (!data.variantNameSnapshot?.trim()) {
      throw new Error('variantNameSnapshot is required');
    }

    if (data.unitPriceSnapshot < 0) {
      throw new Error('unitPriceSnapshot must be greater than or equal to 0');
    }

    if (data.compareAtPriceSnapshot !== undefined && data.compareAtPriceSnapshot < 0) {
      throw new Error('compareAtPriceSnapshot must be greater than or equal to 0');
    }

    this.params.productNameSnapshot = data.productNameSnapshot;
    this.params.variantNameSnapshot = data.variantNameSnapshot;
    this.params.skuSnapshot = data.skuSnapshot;
    this.params.imageSnapshot = data.imageSnapshot;
    this.params.imageVariantSnapshot = data.imageVariantSnapshot;
    this.params.unitPriceSnapshot = data.unitPriceSnapshot;
    this.params.compareAtPriceSnapshot = data.compareAtPriceSnapshot;
    this.touch();
  }

  get subtotal(): number {
    return this.params.quantity * this.params.unitPriceSnapshot;
  }

  get id(): string {
    return this.params.id;
  }

  get cartId(): string {
    return this.params.cartId;
  }

  get productId(): string {
    return this.params.productId;
  }

  get variantId(): string {
    return this.params.variantId;
  }

  get quantity(): number {
    return this.params.quantity;
  }

  get productNameSnapshot(): string {
    return this.params.productNameSnapshot;
  }

  get variantNameSnapshot(): string {
    return this.params.variantNameSnapshot;
  }

  get skuSnapshot(): string | undefined {
    return this.params.skuSnapshot;
  }

  get imageSnapshot(): string | undefined {
    return this.params.imageSnapshot;
  }

  get imageVariantSnapshot(): string | undefined {
    return this.params.imageVariantSnapshot;
  }

  get unitPriceSnapshot(): number {
    return this.params.unitPriceSnapshot;
  }

  get compareAtPriceSnapshot(): number | undefined {
    return this.params.compareAtPriceSnapshot;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
