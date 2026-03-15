import { randomUUID } from 'crypto';

export type AttributeParams = {
  readonly id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export class Attribute {
  constructor(private params: AttributeParams) {}

  static create(data: { name: string; slug: string; sortOrder?: number }): Attribute {
    const now = new Date();

    return new Attribute({
      id: randomUUID(),
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder ?? 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  rename(name: string) {
    this.params.name = name;
    this.touch();
  }

  changeSlug(slug: string) {
    this.params.slug = slug;
    this.touch();
  }

  changeSortOrder(order: number) {
    this.params.sortOrder = order;
    this.touch();
  }

  activate() {
    this.params.isActive = true;
    this.touch();
  }

  deactivate() {
    this.params.isActive = false;
    this.touch();
  }

  private touch() {
    this.params.updatedAt = new Date();
  }

  get id() {
    return this.params.id;
  }

  get name() {
    return this.params.name;
  }

  get slug() {
    return this.params.slug;
  }

  get sortOrder() {
    return this.params.sortOrder;
  }

  get isActive() {
    return this.params.isActive;
  }

  get createdAt() {
    return this.params.createdAt;
  }

  get updatedAt() {
    return this.params.updatedAt;
  }
}
