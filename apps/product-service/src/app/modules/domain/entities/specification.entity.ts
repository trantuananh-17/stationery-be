import { randomUUID } from 'crypto';

export type SpecificationParams = {
  readonly id: string;
  readonly productId: string;
  attributeId: string;
  value: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Specification {
  constructor(private params: SpecificationParams) {}

  static create(data: { productId: string; attributeId: string; value: string }): Specification {
    const now = new Date();

    return new Specification({
      id: randomUUID(),
      productId: data.productId,
      attributeId: data.attributeId,
      value: data.value,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(data: { attributeId?: string; value?: string }) {
    if (data.attributeId !== undefined) {
      this.params.attributeId = data.attributeId.trim();
    }

    if (data.value !== undefined) {
      this.params.value = data.value.trim();
    }

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

  get attributeId() {
    return this.params.attributeId;
  }

  get value() {
    return this.params.value;
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }
}
