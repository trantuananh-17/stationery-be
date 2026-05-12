import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SalesPerformance } from '../../../domain/entities/sales-performance.entity';
import { ISalesPerformanceCommandRepository } from '../../ports/commands/sales-performance-command.repository';
import { SalesPerformanceAction, SalesPerformanceCommand } from './sales-performance.command';

@CommandHandler(SalesPerformanceCommand)
export class SalesPerformanceHandler implements ICommandHandler<SalesPerformanceCommand> {
  constructor(private readonly repository: ISalesPerformanceCommandRepository) {}

  async execute(command: SalesPerformanceCommand): Promise<void> {
    let performance = await this.repository.findByDate(command.date);

    if (!performance) {
      performance = SalesPerformance.create(command.date);
    }

    switch (command.type) {
      case SalesPerformanceAction.ORDER_PAID:
        performance.applyOrderPaid({
          revenue: command.totalRevenue ?? 0,

          orders: command.totalOrders ?? 0,

          estimatedProfit: command.estimatedProfit ?? 0,
        });

        break;
    }

    await this.repository.save(performance);
  }
}
