import { IQuery } from '@nestjs/cqrs';

export class GetReviewsQuery implements IQuery {
  constructor(
    public readonly productId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
