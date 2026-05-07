import { IQuery } from '@nestjs/cqrs';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class GetOrdersByAdminQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly status?: OrderStatus,
    // public readonly orderBy?: AdminProductOrderBy,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
