import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICustomerSummaryCommandRepository } from '../../ports/repositories/customer-summary-command.repo';

import { CustomerSummary } from '../../../domain/entities/customer-summary.entity';

import { UpsertSummaryCommand } from './upsert-sumary.command';

@CommandHandler(UpsertSummaryCommand)
export class UpsertCustomerSummaryHandler implements ICommandHandler<UpsertSummaryCommand> {
  constructor(private readonly customerSummaryRepository: ICustomerSummaryCommandRepository) {}

  async execute(command: UpsertSummaryCommand): Promise<void> {
    let summary = await this.customerSummaryRepository.findByUserId(command.userId);

    if (!summary) {
      summary = CustomerSummary.create(command.userId, command.email);
    }

    if (command.email !== undefined) {
      summary.updateEmail(command.email);
    }

    if (command.isActive !== undefined) {
      summary.updateIsActive(command.isActive);
    }

    if (command.isVerified !== undefined) {
      summary.updateIsVerified(command.isVerified);
    }

    if (command.totalOrdersIncrement !== undefined) {
      summary.increaseTotalOrders(command.totalOrdersIncrement);
    }

    if (command.amountSpentIncrement !== undefined) {
      summary.increaseAmountSpent(command.amountSpentIncrement);
    }

    if (command.lastOrderId !== undefined) {
      summary.updateLastOrder(command.lastOrderId, command.lastOrderTotal, command.lastOrderAt);
    }

    await this.customerSummaryRepository.upsert(summary);
  }
}
