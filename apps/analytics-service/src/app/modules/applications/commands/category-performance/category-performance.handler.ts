import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  CategoryPerformanceAction,
  CategoryPerformanceCommand,
} from './category-performance.command';
import { CategoryPerformance } from '../../../domain/entities/category-performanc.entity';
import { ICategoryPerformanceCommandRepository } from '../../ports/commands/category-performance-command.repository';

@CommandHandler(CategoryPerformanceCommand)
export class CategoryPerformanceHandler implements ICommandHandler<CategoryPerformanceCommand> {
  constructor(private readonly repository: ICategoryPerformanceCommandRepository) {}

  async execute(command: CategoryPerformanceCommand): Promise<void> {
    let performance = await this.repository.findByCategoryAndDate(command.categoryId, command.date);

    if (!performance) {
      performance = CategoryPerformance.create({
        bucketDate: command.date,

        categoryId: command.categoryId,

        categoryName: command.categoryName,
      });
    }

    switch (command.type) {
      case CategoryPerformanceAction.ORDER_PAID:
        performance.applyOrderItem({
          quantity: command.quantity,

          subtotal: command.revenue,
        });

        break;
    }

    await this.repository.save(performance);
  }
}
