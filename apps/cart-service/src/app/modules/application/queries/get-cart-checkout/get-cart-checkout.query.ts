import { IQuery } from '@nestjs/cqrs';

export class GetCartCheckoutQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
