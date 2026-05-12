export class GetTopProductsQuery {
  constructor(
    public readonly startDate: string,

    public readonly endDate: string,

    public readonly limit = 5,
  ) {}
}
