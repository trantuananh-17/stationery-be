import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { toTimestamp } from '@common/utils/common.util';

import { IOrderQueryRepository } from '../../ports/repositories/order-query.repo';

import { GetOrdersByAdminQuery } from './get-orders-admin.query';
import { OrderAdminGrpcDto } from './get-orders-admin.dto';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export type GetOrdersByAdminResult = PaginatedResult<OrderAdminGrpcDto>;

@QueryHandler(GetOrdersByAdminQuery)
export class GetOrdersByAdminHandler
  implements IQueryHandler<GetOrdersByAdminQuery, GetOrdersByAdminResult>
{
  constructor(private readonly orderRepo: IOrderQueryRepository) {}

  async execute(query: GetOrdersByAdminQuery): Promise<GetOrdersByAdminResult> {
    const { search, status, orderBy, page, limit } = query;

    const normalizedSearch = search?.trim();

    const result = await this.orderRepo.findAll({
      search: normalizedSearch,
      status,
      orderBy,
      page,
      limit,
    });

    const data: OrderAdminGrpcDto[] = result.items.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      productName: order.productName,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: toTimestamp(order.createdAt) as GrpcTimestamp,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.total > 0 ? Math.ceil(result.total / limit) : 0,
      },
    };
  }
}
