import { randomUUID } from 'crypto';

export type VariantAttributeParams = {
  readonly id: string;
  readonly variantId: string;
  readonly attributeValueId: string;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class VariantAttribute {
  constructor(private params: VariantAttributeParams) {}

  static create(data: { variantId: string; attributeValueId: string }): VariantAttribute {
    const now = new Date();

    return new VariantAttribute({
      id: randomUUID(),
      variantId: data.variantId,
      attributeValueId: data.attributeValueId,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id() {
    return this.params.id;
  }

  get variantId() {
    return this.params.variantId;
  }

  get attributeValueId() {
    return this.params.attributeValueId;
  }
}
