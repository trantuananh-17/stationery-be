import { randomUUID } from 'crypto';

export type ProductParams = {
  readonly id: string;
  name: string;
  readonly categoryId: string;

  readonly createdAt: Date;
  updatedAt: Date;
};

export class Product {
  constructor(private params: ProductParams) {}

  static create(name: string, categoryId: string): Product {
    const now = new Date();
    return new Product({
      id: randomUUID(),
      name,
      categoryId,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.params.id;
  }

  get name(): string {
    return this.params.name;
  }

  get categoryId(): string {
    return this.params.categoryId;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
