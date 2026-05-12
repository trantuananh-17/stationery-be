import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  RecentTransaction,
  RecentTransactionStatus,
} from '../../../domain/entities/recent-transaction.entity';

import { RecentTransactionAction, RecentTransactionCommand } from './recent-transaction.command';
import { IRecentTransactionCommandRepository } from '../../ports/commands/recent-transaction-command.repository';

@CommandHandler(RecentTransactionCommand)
export class RecentTransactionHandler implements ICommandHandler<RecentTransactionCommand> {
  constructor(private readonly repository: IRecentTransactionCommandRepository) {}

  async execute(command: RecentTransactionCommand): Promise<void> {
    switch (command.type) {
      case RecentTransactionAction.CREATE: {
        const transaction = RecentTransaction.create({
          orderId: command.orderId,

          customerId: command.customerId ?? '',

          customerName: command.customerName ?? '',

          totalAmount: command.totalAmount ?? 0,

          totalItems: command.totalItems ?? 0,

          orderedAt: command.orderedAt ?? new Date(),
        });

        await this.repository.save(transaction);

        break;
      }

      case RecentTransactionAction.UPDATE_STATUS: {
        const transaction = await this.repository.findByOrderId(command.orderId);

        if (!transaction) {
          return;
        }

        switch (command.status) {
          case RecentTransactionStatus.PROCESSING:
            transaction.markProcessing();

            break;

          case RecentTransactionStatus.SHIPPED:
            transaction.markShipped();

            break;

          case RecentTransactionStatus.DELIVERED:
            transaction.markDelivered();

            break;

          case RecentTransactionStatus.CANCELLED:
            transaction.markCancelled();

            break;
        }

        await this.repository.save(transaction);

        break;
      }
    }
  }
}
