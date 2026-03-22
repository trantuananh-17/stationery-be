import { IQuery } from '@nestjs/cqrs';

export class GetItemQuery implements IQuery {
  constructor(public readonly variantId: string) {}
}
