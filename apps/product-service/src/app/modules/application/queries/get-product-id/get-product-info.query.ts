import { IQuery } from '@nestjs/cqrs';

export class GetProductInfoQuery implements IQuery {
  constructor(
    public readonly productId?: string,
    public readonly slug?: string,
  ) {}
}
