import { IQuery } from '@nestjs/cqrs';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class GetMyOrdersQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly status?: OrderStatus,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
