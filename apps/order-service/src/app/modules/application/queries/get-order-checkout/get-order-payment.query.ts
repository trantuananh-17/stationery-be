import { IQuery } from '@nestjs/cqrs';

export class GetOrderPaymentQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly orderId: string,
  ) {}
}
