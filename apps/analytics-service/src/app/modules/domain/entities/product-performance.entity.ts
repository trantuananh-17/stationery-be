import { randomUUID } from 'crypto';

export type ProductPerformanceParams = {
  readonly id: string;

  readonly bucketDate: string;

  readonly productId: string;

  productName: string;

  categoryId: string;

  categoryName: string;

  quantitySold: number;

  totalRevenue: number;

  estimatedProfit: number;

  totalOrders: number;

  readonly createdAt: Date;

  updatedAt: Date;
};

export class ProductPerformance {
  constructor(private params: ProductPerformanceParams) {}

  static create(data: {
    bucketDate: string;

    productId: string;

    productName: string;

    categoryId: string;

    categoryName: string;
  }): ProductPerformance {
    const now = new Date();

    return new ProductPerformance({
      id: randomUUID(),

      bucketDate: data.bucketDate,

      productId: data.productId,

      productName: data.productName,

      categoryId: data.categoryId,

      categoryName: data.categoryName,

      quantitySold: 0,

      totalRevenue: 0,

      estimatedProfit: 0,

      totalOrders: 0,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(params: ProductPerformanceParams) {
    return new ProductPerformance(params);
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  applyOrderItem(data: {
    quantity: number;

    subtotal: number;
  }) {
    if (data.quantity <= 0) {
      throw new Error('quantity must be greater than 0');
    }

    if (data.subtotal <= 0) {
      throw new Error('subtotal must be greater than 0');
    }

    this.params.quantitySold += data.quantity;

    this.params.totalRevenue += data.subtotal;

    this.params.totalOrders += 1;

    this.params.estimatedProfit += data.subtotal * 0.7;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get bucketDate(): string {
    return this.params.bucketDate;
  }

  get productId(): string {
    return this.params.productId;
  }

  get productName(): string {
    return this.params.productName;
  }

  get categoryId(): string {
    return this.params.categoryId;
  }

  get categoryName(): string {
    return this.params.categoryName;
  }

  get quantitySold(): number {
    return this.params.quantitySold;
  }

  get totalRevenue(): number {
    return this.params.totalRevenue;
  }

  get estimatedProfit(): number {
    return this.params.estimatedProfit;
  }

  get totalOrders(): number {
    return this.params.totalOrders;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
