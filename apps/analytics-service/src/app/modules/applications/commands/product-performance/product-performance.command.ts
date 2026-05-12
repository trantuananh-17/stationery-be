export enum ProductPerformanceAction {
  ORDER_PAID = 'ORDER_PAID',
}

export class ProductPerformanceCommand {
  constructor(
    public readonly type: ProductPerformanceAction,

    public readonly date: string,

    public readonly productId: string,

    public readonly productName: string,

    public readonly categoryId: string,

    public readonly categoryName: string,

    public readonly quantity: number,

    public readonly revenue: number,
  ) {}
}
