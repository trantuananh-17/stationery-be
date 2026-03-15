import { randomUUID } from 'crypto';

export type AttributeValueParams = {
  readonly id: string;
  readonly attributeId: string;
  value: string;
  slug: string;
  sortOrder: number;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class AttributeValue {
  constructor(private params: AttributeValueParams) {}

  static create(data: {
    attributeId: string;
    value: string;
    slug: string;
    sortOrder?: number;
  }): AttributeValue {
    const now = new Date();

    return new AttributeValue({
      id: randomUUID(),
      attributeId: data.attributeId,
      value: data.value,
      slug: data.slug,
      sortOrder: data.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateValue(value: string) {
    this.params.value = value;
    this.touch();
  }

  updateSortOrder(order: number) {
    this.params.sortOrder = order;
    this.touch();
  }

  private touch() {
    this.params.updatedAt = new Date();
  }

  get id() {
    return this.params.id;
  }

  get attributeId() {
    return this.params.attributeId;
  }

  get value() {
    return this.params.value;
  }

  get slug() {
    return this.params.slug;
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
