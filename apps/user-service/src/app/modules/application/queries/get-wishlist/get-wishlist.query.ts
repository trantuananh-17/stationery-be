import { IQuery } from '@nestjs/cqrs';

export class GetWishlistQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
