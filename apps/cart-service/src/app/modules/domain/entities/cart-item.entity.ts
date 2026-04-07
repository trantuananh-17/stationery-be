import { randomUUID } from 'crypto';

export type CartItemAttributeSnapshot = {
  name: string;
  value: string;
};

export type CartItemParams = {
  readonly id: string;
  readonly cartId: string;
  readonly productId: string;
  readonly variantId: string;
  quantity: number;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot: string;
  productThumbnailSnapshot: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  attributesSnapshot: CartItemAttributeSnapshot[];
  readonly createdAt: Date;
  updatedAt: Date;
};

export type CartItemSnapshot = {
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot: string;
  productThumbnailSnapshot: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  attributesSnapshot: CartItemAttributeSnapshot[];
};

export type UpdateCartItemSnapshotParams = {
  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot: string;
  productThumbnailSnapshot: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  attributesSnapshot: CartItemAttributeSnapshot[];
};

export class CartItem {
  constructor(private params: CartItemParams) {
    this.validate();
  }

  static create(data: CartItemSnapshot): CartItem {
    const now = new Date();

    return new CartItem({
      id: randomUUID(),
      cartId: data.cartId,
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
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(params: CartItemParams): CartItem {
    return new CartItem(params);
  }

  private validate(): void {
    if (!this.params.id?.trim()) {
      throw new Error('id is required');
    }

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

    if (!this.params.productSlugSnapshot?.trim()) {
      throw new Error('productSlugSnapshot is required');
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

    if (!Array.isArray(this.params.attributesSnapshot)) {
      throw new Error('attributesSnapshot must be an array');
    }

    for (const attribute of this.params.attributesSnapshot) {
      if (!attribute.name?.trim()) {
        throw new Error('attribute name is required');
      }

      if (!attribute.value?.trim()) {
        throw new Error('attribute value is required');
      }
    }
  }

  private setUpdatedAt(): void {
    this.params.updatedAt = new Date();
  }

  changeQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    this.params.quantity = quantity;
    this.setUpdatedAt();
  }

  increaseQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    this.params.quantity += quantity;
    this.setUpdatedAt();
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
    this.setUpdatedAt();
  }

  updateSnapshot(snapshot: UpdateCartItemSnapshotParams): void {
    this.params.productNameSnapshot = snapshot.productNameSnapshot;
    this.params.productSlugSnapshot = snapshot.productSlugSnapshot;
    this.params.variantNameSnapshot = snapshot.variantNameSnapshot;
    this.params.skuSnapshot = snapshot.skuSnapshot;
    this.params.productThumbnailSnapshot = snapshot.productThumbnailSnapshot;
    this.params.imageVariantSnapshot = snapshot.imageVariantSnapshot;
    this.params.unitPriceSnapshot = snapshot.unitPriceSnapshot;
    this.params.compareAtPriceSnapshot = snapshot.compareAtPriceSnapshot;
    this.params.attributesSnapshot = snapshot.attributesSnapshot;

    this.validate();
    this.setUpdatedAt();
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

  get productSlugSnapshot(): string {
    return this.params.productSlugSnapshot;
  }

  get variantNameSnapshot(): string {
    return this.params.variantNameSnapshot;
  }

  get skuSnapshot(): string {
    return this.params.skuSnapshot;
  }

  get productThumbnailSnapshot(): string {
    return this.params.productThumbnailSnapshot;
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

  get attributesSnapshot(): CartItemAttributeSnapshot[] {
    return [...this.params.attributesSnapshot];
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
