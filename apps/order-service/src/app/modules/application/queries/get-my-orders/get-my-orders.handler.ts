import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { toTimestamp } from '@common/utils/common.util';

import { IOrderQueryRepository } from '../../ports/repositories/order-query.repo';
import { GetMyOrdersQuery } from './get-my-orders.query';
import { CustomerOrderDetailGrpc } from './get-my-orders.dto';

export type GetMyOrdersResult = PaginatedResult<CustomerOrderDetailGrpc>;

@QueryHandler(GetMyOrdersQuery)
export class GetMyOrdersHandler implements IQueryHandler<GetMyOrdersQuery, GetMyOrdersResult> {
  constructor(private readonly orderRepo: IOrderQueryRepository) {}

  async execute(query: GetMyOrdersQuery): Promise<GetMyOrdersResult> {
    const { userId, status, page, limit } = query;

    const result = await this.orderRepo.findOrdersByUserId(userId, {
      status,
      page,
      limit,
    });

    const data: CustomerOrderDetailGrpc[] = result.items.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      trackingNumber: order.trackingNumber,
      shippingProvider: order.shippingProvider,
      shippingAddress: order.shippingAddress,
      items: order.items,
      totalItems: order.totalItems,
      totalUniqueItems: order.totalUniqueItems,
      estimatedDelivery: order.estimatedDelivery
        ? (toTimestamp(order.estimatedDelivery) as GrpcTimestamp)
        : undefined,
      paidAt: order.paidAt ? (toTimestamp(order.paidAt) as GrpcTimestamp) : undefined,
      shippedAt: order.shippedAt ? (toTimestamp(order.shippedAt) as GrpcTimestamp) : undefined,
      deliveredAt: order.deliveredAt
        ? (toTimestamp(order.deliveredAt) as GrpcTimestamp)
        : undefined,
      cancelledAt: order.cancelledAt
        ? (toTimestamp(order.cancelledAt) as GrpcTimestamp)
        : undefined,
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
