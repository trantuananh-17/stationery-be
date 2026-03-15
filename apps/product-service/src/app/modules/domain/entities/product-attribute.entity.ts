import { randomUUID } from 'crypto';

export type ProductAttributeParams = {
  readonly id: string;
  readonly productId: string;
  readonly attributeId: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class ProductAttribute {
  constructor(private params: ProductAttributeParams) {}

  static create(data: { productId: string; attributeId: string }): ProductAttribute {
    const now = new Date();

    return new ProductAttribute({
      id: randomUUID(),
      productId: data.productId,
      attributeId: data.attributeId,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id() {
    return this.params.id;
  }

  get productId() {
    return this.params.productId;
  }

  get attributeId() {
    return this.params.attributeId;
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }
}
