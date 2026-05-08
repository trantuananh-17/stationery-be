import { IQuery } from '@nestjs/cqrs';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { OrderSort } from '../../../domain/enums/order-sort.enum';

export class GetOrdersByAdminQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly status?: OrderStatus,
    public readonly orderBy?: OrderSort,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
