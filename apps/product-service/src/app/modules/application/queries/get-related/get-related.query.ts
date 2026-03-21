import { IQuery } from '@nestjs/cqrs';

export class GetRelatedQuery implements IQuery {
  constructor(
    public readonly productId: string,
    public readonly limit = 8,
  ) {}
}
