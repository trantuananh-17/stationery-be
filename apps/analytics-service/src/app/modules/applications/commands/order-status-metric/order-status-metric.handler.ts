import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrderStatusMetric } from '../../../domain/entities/order-status-metric.entity';

import { OrderStatusMetricAction, OrderStatusMetricCommand } from './order-status-metric.command';
import { IOrderStatusMetricCommandRepository } from '../../ports/commands/order-status-metric-command.repository';

@CommandHandler(OrderStatusMetricCommand)
export class OrderStatusMetricHandler implements ICommandHandler<OrderStatusMetricCommand> {
  constructor(private readonly repository: IOrderStatusMetricCommandRepository) {}

  async execute(command: OrderStatusMetricCommand): Promise<void> {
    let metric = await this.repository.findByDate(command.date);

    if (!metric) {
      metric = OrderStatusMetric.create(command.date);
    }

    switch (command.type) {
      case OrderStatusMetricAction.ORDER_CREATED:
        metric.increasePending();

        break;

      case OrderStatusMetricAction.ORDER_PROCESSING:
        metric.movePendingToProcessing();

        break;

      case OrderStatusMetricAction.ORDER_SHIPPED:
        metric.moveProcessingToShipped();

        break;

      case OrderStatusMetricAction.ORDER_DELIVERED:
        metric.moveShippedToDelivered();

        break;

      case OrderStatusMetricAction.ORDER_CANCELLED:
        metric.increaseCancelled();

        break;
    }

    await this.repository.save(metric);
  }
}
