import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

import { IEventPublisher } from '../../ports/producers/event-publisher.port';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';

import { OrderNotFound } from '../../../domain/errors/order.error';
import { HandlePaymentCommand } from './handle-payment.command';

@CommandHandler(HandlePaymentCommand)
export class HandlePaymentHandler implements ICommandHandler<HandlePaymentCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: HandlePaymentCommand): Promise<void> {
    const { eventId, orderId, paymentStatus, paymentTransactionId, paymentProvider } = command;

    const order = await this.orderCommandRepo.findById(orderId);

    if (!order) {
      throw new OrderNotFound();
    }

    if (paymentStatus === PaymentStatus.PAID && order.paymentStatus === PaymentStatus.PAID) {
      return;
    }

    switch (paymentStatus) {
      case PaymentStatus.PAID:
        order.markPaid(paymentTransactionId, paymentProvider);
        break;

      case PaymentStatus.FAILED:
        order.markPaymentFailed(paymentTransactionId, paymentProvider);
        break;
    }

    await this.orderCommandRepo.save(order);

    if (paymentStatus === PaymentStatus.PAID) {
      await this.eventPublisher.emitOrderConfirmed({
        eventId,
        items: order.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      await this.eventPublisher.emitSyncUserSumary({
        userId: order.userId,
        email: order.email,

        amountSpentIncrement: order.total,
        totalOrdersIncrement: 1,

        lastOrderId: order.id,
        lastOrderTotal: order.total,
        lastOrderAt: order.createdAt,
      });
    }

    if (paymentStatus === PaymentStatus.FAILED) {
      await this.eventPublisher.emitOrderCanceled({
        eventId,
        items: order.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
    }

    await this.eventPublisher.emitSyncLastOrder({
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
    });
  }
}
