import { Controller } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';

import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomerCreatedKafkaDto } from './dtos/customer-created-kafka.dto';
import {
  DailyMetricAction,
  DailyMetricCommand,
} from '../../applications/commands/daily-metric/daily-metric.command';
import {
  GoalTrackingAction,
  GoalTrackingCommand,
} from '../../applications/commands/goal-tracking/goal-tracking.command';

@Controller()
export class CustomerConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('customer.created')
  async handleCustomerCreated(
    @Payload()
    payload: CustomerCreatedKafkaDto,
  ) {
    const date = payload.createdAt.split('T')[0];

    const month = payload.createdAt.slice(0, 7);

    await this.commandBus.execute(
      new DailyMetricCommand(
        DailyMetricAction.CUSTOMER_CREATED,

        date,
      ),
    );

    await this.commandBus.execute(
      new GoalTrackingCommand(
        GoalTrackingAction.CUSTOMER_CREATED,

        month,
      ),
    );
  }
}
