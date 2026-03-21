import { IQuery } from '@nestjs/cqrs';

export class GetFeaturedQuery implements IQuery {
  constructor(
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
