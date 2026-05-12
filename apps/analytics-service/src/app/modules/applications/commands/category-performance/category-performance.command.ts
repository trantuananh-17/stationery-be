export enum CategoryPerformanceAction {
  ORDER_PAID = 'ORDER_PAID',
}

export class CategoryPerformanceCommand {
  constructor(
    public readonly type: CategoryPerformanceAction,

    public readonly date: string,

    public readonly categoryId: string,

    public readonly categoryName: string,

    public readonly quantity: number,

    public readonly revenue: number,
  ) {}
}
