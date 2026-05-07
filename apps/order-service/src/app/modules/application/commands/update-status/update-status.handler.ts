import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

import { IEventPublisher } from '../../ports/producers/event-publisher.port';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';

import { UpdateStatusCommand } from './update-status.command';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,

    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
    const { eventId, orderId, orderStatus, paymentStatus, paymentTransactionId, paymentProvider } =
      command;

    const order = await this.orderCommandRepo.findById(orderId);

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    switch (paymentStatus) {
      case PaymentStatus.PAID:
        order.markPaid(paymentTransactionId, paymentProvider);
        break;

      case PaymentStatus.FAILED:
        order.markPaymentFailed(paymentTransactionId, paymentProvider);
        break;
    }

    switch (orderStatus) {
      case OrderStatus.PROCESSING:
        order.markProcessing();
        break;

      case OrderStatus.SHIPPED:
        order.markShipped();
        break;

      case OrderStatus.DELIVERED:
        order.markDelivered();
        break;

      case OrderStatus.CANCELLED:
        order.cancel();
        break;
    }

    await this.orderCommandRepo.save(order);

    const orderItems = await this.orderCommandRepo.getOrderItemInput(orderId);

    if (paymentStatus === PaymentStatus.PAID || orderStatus === OrderStatus.PROCESSING) {
      await this.eventPublisher.emitOrderConfirmed({
        eventId,
        items: orderItems,
      });
    }

    if (paymentStatus === PaymentStatus.FAILED || orderStatus === OrderStatus.CANCELLED) {
      await this.eventPublisher.emitOrderCanceled({
        eventId,
        items: orderItems,
      });
    }
  }
}
