import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProductPerformance } from '../../../domain/entities/product-performance.entity';

import { ProductPerformanceAction, ProductPerformanceCommand } from './product-performance.command';
import { IProductPerformanceCommandRepository } from '../../ports/commands/product-performance-command.repository';

@CommandHandler(ProductPerformanceCommand)
export class ProductPerformanceHandler implements ICommandHandler<ProductPerformanceCommand> {
  constructor(private readonly repository: IProductPerformanceCommandRepository) {}

  async execute(command: ProductPerformanceCommand): Promise<void> {
    let performance = await this.repository.findByProductAndDate(command.productId, command.date);

    if (!performance) {
      performance = ProductPerformance.create({
        bucketDate: command.date,

        productId: command.productId,

        productName: command.productName,

        categoryId: command.categoryId,

        categoryName: command.categoryName,
      });
    }

    switch (command.type) {
      case ProductPerformanceAction.ORDER_PAID:
        performance.applyOrderItem({
          quantity: command.quantity,

          subtotal: command.revenue,
        });

        break;
    }

    await this.repository.save(performance);
  }
}
