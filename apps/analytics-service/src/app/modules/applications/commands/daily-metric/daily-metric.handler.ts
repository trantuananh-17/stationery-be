import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DailyMetric } from '../../../domain/entities/daily-metric.entity';

import { IDailyMetricCommandRepository } from '../../ports/commands/daily-metric-command.repository';

import { DailyMetricAction, DailyMetricCommand } from './daily-metric.command';

@CommandHandler(DailyMetricCommand)
export class DailyMetricHandler implements ICommandHandler<DailyMetricCommand> {
  constructor(private readonly repository: IDailyMetricCommandRepository) {}

  async execute(command: DailyMetricCommand): Promise<void> {
    let metric = await this.repository.findByDate(command.date);

    if (!metric) {
      metric = DailyMetric.create(command.date);
    }

    switch (command.type) {
      case DailyMetricAction.ORDER_PAID:
        metric.applyOrderPaid({
          totalAmount: command.totalAmount ?? 0,
        });

        break;

      case DailyMetricAction.CUSTOMER_CREATED:
        metric.applyCustomerCreated();

        break;
    }

    await this.repository.save(metric);
  }
}
