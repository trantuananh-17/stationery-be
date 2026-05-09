import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertLastOrderCommand } from './upsert-last-order.command';
import { ILastOrderCommandRepository } from '../../ports/repositories/last-order-command.repo';
import { LastOrder } from '../../../domain/entities/last-order.entity';
@CommandHandler(UpsertLastOrderCommand)
export class UpsertLastOrderHandler implements ICommandHandler<UpsertLastOrderCommand> {
  constructor(private readonly lastOrderRepository: ILastOrderCommandRepository) {}

  async execute(command: UpsertLastOrderCommand): Promise<void> {
    let snapshot = await this.lastOrderRepository.findByUserId(command.userId);

    if (!snapshot) {
      snapshot = LastOrder.create({
        userId: command.userId,

        orderId: command.orderId,

        orderNumber: command.orderNumber,

        totalPrice: command.totalPrice,

        orderStatus: command.orderStatus,

        paymentStatus: command.paymentStatus,

        orderedAt: command.orderedAt,

        items: command.items,
      });
    } else {
      snapshot.replace({
        orderId: command.orderId,

        orderNumber: command.orderNumber,

        totalPrice: command.totalPrice,

        orderStatus: command.orderStatus,

        paymentStatus: command.paymentStatus,

        orderedAt: command.orderedAt,

        items: command.items,
      });
    }

    await this.lastOrderRepository.upsert(snapshot);
  }
}
