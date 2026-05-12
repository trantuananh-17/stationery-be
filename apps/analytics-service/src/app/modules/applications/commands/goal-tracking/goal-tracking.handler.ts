import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GoalTrackingAction, GoalTrackingCommand } from './goal-tracking.command';
import { IGoalTrackingCommandRepository } from '../../ports/commands/goal-tracking-command.repository';

@CommandHandler(GoalTrackingCommand)
export class GoalTrackingHandler implements ICommandHandler<GoalTrackingCommand> {
  constructor(private readonly repository: IGoalTrackingCommandRepository) {}

  async execute(command: GoalTrackingCommand): Promise<void> {
    const goal = await this.repository.findByMonth(command.bucketMonth);

    if (!goal) {
      return;
    }

    switch (command.type) {
      case GoalTrackingAction.ORDER_PAID:
        goal.applyOrderPaid({
          revenue: command.revenue ?? 0,

          orders: command.orders ?? 0,
        });

        break;

      case GoalTrackingAction.CUSTOMER_CREATED:
        goal.applyCustomerCreated();

        break;
    }

    await this.repository.save(goal);
  }
}
