import { IQuery } from '@nestjs/cqrs';

export class GetProductsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
