import { randomUUID } from 'crypto';

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
};

export class Variant {
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
    name?: string;
    sku?: string;
    price?: number;
    compareAtPrice?: number;
    images?: string;
    sortOrder?: number;
  }) {
    if (data.name !== undefined) {
      this.params.name = data.name;
    }

    if (data.sku !== undefined) {
      this.params.sku = data.sku;
    }

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

    this.touch();
  }

  setDefault() {
    this.params.isDefault = true;
    this.touch();
  }

  unsetDefault() {
    this.params.isDefault = false;
    this.touch();
  }

  activate() {
    this.params.isAvailable = true;
    this.touch();
  }

  deactivate() {
    this.params.isAvailable = false;
    this.touch();
  }

  private touch() {
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
}
