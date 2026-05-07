import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { toTimestamp } from '@common/utils/common.util';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { IOrderQueryRepository } from '../../ports/repositories/order-query.repo';
import { OrderNotFound } from '../../../domain/errors/order.error';
import { GetMyOrderQuery } from './get-my-order.query';
import { OrderDetailGrpcResponse } from './get-my-order.dto';

@QueryHandler(GetMyOrderQuery)
export class GetMyOrderHandler implements IQueryHandler<GetMyOrderQuery, OrderDetailGrpcResponse> {
  constructor(
    @Inject(IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
  ) {}

  async execute(query: GetMyOrderQuery): Promise<OrderDetailGrpcResponse> {
    const order = await this.orderQueryRepository.findByIdAndUserId(query.orderId, query.userId);

    if (!order) {
      throw new OrderNotFound();
    }

    return {
      id: order.id,
      orderNumber: order.number,
      userId: order.userId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress,
      totalItems: order.totalItems,
      totalUniqueItems: order.totalUniqueItems,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        attributes: item.attributes,
      })),

      paymentExpiredAt: order.paymentExpiredAt
        ? (toTimestamp(order.paymentExpiredAt) as GrpcTimestamp)
        : undefined,
      paidAt: order.paidAt ? (toTimestamp(order.paidAt) as GrpcTimestamp) : undefined,
      shippedAt: order.shippedAt ? (toTimestamp(order.shippedAt) as GrpcTimestamp) : undefined,
      deliveredAt: order.deliveredAt
        ? (toTimestamp(order.deliveredAt) as GrpcTimestamp)
        : undefined,
      cancelledAt: order.cancelledAt
        ? (toTimestamp(order.cancelledAt) as GrpcTimestamp)
        : undefined,
      estimatedDelivery: order.estimatedDelivery
        ? (toTimestamp(order.estimatedDelivery) as GrpcTimestamp)
        : undefined,
      createdAt: toTimestamp(order.createdAt) as GrpcTimestamp,
      updatedAt: toTimestamp(order.updatedAt) as GrpcTimestamp,
    };
  }
}
