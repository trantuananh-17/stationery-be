import { randomUUID } from 'crypto';
import { VariantAttribute } from './variant-attribute.entity';

export type VariantParams = {
  readonly id: string;
  readonly productId: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  images?: string;
  sortOrder: number;
  isDefault: boolean;
  isAvailable: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export class Variant {
  private attributes: VariantAttribute[] = [];

  constructor(private params: VariantParams) {}

  static create(data: {
    productId: string;
    name: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    images?: string;
    sortOrder?: number;
    isDefault?: boolean;
  }): Variant {
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (!data.sku || !data.sku.trim()) {
      throw new Error('SKU is required');
    }
    const now = new Date();

    return new Variant({
      id: randomUUID(),
      productId: data.productId,
      name: data.name,
      sku: data.sku,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      images: data.images,
      sortOrder: data.sortOrder ?? 0,
      isDefault: data.isDefault ?? false,
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateInfo(data: {
    price?: number;
    compareAtPrice?: number;
    images?: string;
    sortOrder?: number;
    isDefault?: boolean;
    isAvailable?: boolean;
  }) {
    if (data.price !== undefined) {
      if (data.price < 0) {
        throw new Error('Price cannot be negative');
      }
      this.params.price = data.price;
    }

    if (data.compareAtPrice !== undefined) {
      this.params.compareAtPrice = data.compareAtPrice;
    }

    if (data.images !== undefined) {
      this.params.images = data.images;
    }

    if (data.sortOrder !== undefined) {
      this.params.sortOrder = data.sortOrder;
    }

    if (data.isDefault !== undefined) {
      this.params.isDefault = data.isDefault;
    }

    if (data.isAvailable !== undefined) {
      this.params.isAvailable = data.isAvailable;
    }

    this.setUpdatedAt();
  }

  addAttribute(attributeValueId: string) {
    const attr = VariantAttribute.create({
      variantId: this.id,
      attributeValueId,
    });

    this.attributes.push(attr);
  }

  loadAttribute(attribute: VariantAttribute) {
    this.attributes.push(attribute);
  }

  getAttributes() {
    return [...this.attributes];
  }

  setDefault() {
    this.params.isDefault = true;
    this.setUpdatedAt();
  }

  unsetDefault() {
    this.params.isDefault = false;
    this.setUpdatedAt();
  }

  activate() {
    this.params.isAvailable = true;
    this.setUpdatedAt();
  }

  deactivate() {
    this.params.isAvailable = false;
    this.setUpdatedAt();
  }

  remove() {
    this.params.deletedAt = new Date();
    this.setUpdatedAt();
  }

  restore() {
    this.params.deletedAt = null;
    this.setUpdatedAt();
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  get id() {
    return this.params.id;
  }

  get productId() {
    return this.params.productId;
  }

  get name() {
    return this.params.name;
  }

  get sku() {
    return this.params.sku;
  }

  get price() {
    return this.params.price;
  }

  get compareAtPrice() {
    return this.params.compareAtPrice;
  }

  get images() {
    return this.params.images;
  }

  get isAvailable() {
    return this.params.isAvailable;
  }

  get isDefault() {
    return this.params.isDefault;
  }

  get sortOrder() {
    return this.params.sortOrder;
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.params.deletedAt;
  }
}
