import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

import { IEventPublisher } from '../../ports/producers/event-publisher.port';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';

import { UpdateStatusCommand } from './update-status.command';

import { OrderNotFound } from '../../../domain/errors/order.error';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
    const { orderId, orderStatus } = command;

    const order = await this.orderCommandRepo.findById(orderId);

    if (!order) {
      throw new OrderNotFound();
    }

    const projectionPromises: Promise<void>[] = [];

    switch (orderStatus) {
      case OrderStatus.PROCESSING:
        order.markProcessing();
        break;

      case OrderStatus.SHIPPED:
        order.markShipped();

        projectionPromises.push(
          this.eventPublisher.emitOrderConfirmed({
            eventId: crypto.randomUUID(),
            items: order.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }),
        );

        break;

      case OrderStatus.DELIVERED:
        order.markDelivered();

        if (order.paymentMethod === 'cod' && order.paymentStatus !== PaymentStatus.PAID) {
          order.markPaid();
        }

        break;

      case OrderStatus.CANCELLED:
        order.cancel();
        break;
    }

    await this.orderCommandRepo.save(order);

    projectionPromises.push(
      this.eventPublisher.emitSyncLastOrder({
        userId: order.userId,

        orderId: order.id,
        orderNumber: order.number,

        totalPrice: order.total,

        orderStatus: order.status,
        paymentStatus: order.paymentStatus,

        orderedAt: order.createdAt,

        items: order.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,

          name: item.name,

          sku: item.sku,
          thumbnail: item.image,

          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,

          attributes: item.attributes ?? [],
        })),
      }),
    );

    if (order.paymentMethod === 'cod' && order.paymentStatus === PaymentStatus.PAID) {
      projectionPromises.push(
        this.eventPublisher.emitSyncUserSumary({
          userId: order.userId,
          email: order.email,

          amountSpentIncrement: order.total,
          totalOrdersIncrement: 1,

          lastOrderId: order.id,
          lastOrderTotal: order.total,
          lastOrderAt: order.createdAt,
        }),
      );
    }

    await Promise.all(projectionPromises);
  }
}
