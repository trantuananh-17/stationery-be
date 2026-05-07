import { IQuery } from '@nestjs/cqrs';

export class GetMyOrderQuery implements IQuery {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
  ) {}
}
