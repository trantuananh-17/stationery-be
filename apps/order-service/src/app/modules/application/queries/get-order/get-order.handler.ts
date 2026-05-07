import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { toTimestamp } from '@common/utils/common.util';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { IOrderQueryRepository } from '../../ports/repositories/order-query.repo';
import { GetOrderQuery } from './get-order.query';
import { OrderNotFound } from '../../../domain/errors/order.error';
import { OrderDetailGrpcResponse } from './get-order.dto';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, OrderDetailGrpcResponse> {
  constructor(
    @Inject(IOrderQueryRepository)
    private readonly orderQueryRepository: IOrderQueryRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderDetailGrpcResponse> {
    const order = await this.orderQueryRepository.findById(query.orderId);

    if (!order) {
      throw new OrderNotFound();
    }

    return {
      id: order.id,
      orderNumber: order.number,
      userId: order.userId,
      customerEmail: order.email,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentTransactionId: order.paymentTransactionId,
      paymentProvider: order.paymentProvider,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      notes: order.notes,
      trackingNumber: order.trackingNumber,
      shippingProvider: order.shippingProvider,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
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
