import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateStatusCommand } from './update-status.command';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
// import {
//   ORDER_EVENT_PUBLISHER,
//   OrderEventPublisher,
// } from '../../ports/event-publisher.port';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,

    // @Inject(ORDER_EVENT_PUBLISHER)
    // private readonly orderEventPublisher: OrderEventPublisher,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
    const { orderId, orderStatus, paymentStatus, paymentTransactionId, paymentProvider } = command;

    await this.orderCommandRepo.updatePaymentStatus({
      orderId,
      orderStatus,
      paymentStatus,
      paymentTransactionId,
      paymentProvider,
    });

    if (paymentStatus === PaymentStatus.PAID || orderStatus === OrderStatus.PROCESSING) {
      // await this.orderEventPublisher.emitOrderReserveConfirmed({
      //   orderId,
      // });
    }

    if (paymentStatus === PaymentStatus.FAILED || orderStatus === OrderStatus.CANCELLED) {
      // await this.orderEventPublisher.emitOrderReserveReleased({
      //   orderId,
      // });
    }
  }
}
