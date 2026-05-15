import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteProductCommand } from './delete-product.command';

import { IProductCommandRepository } from '../../../ports/repositories/product-command.repo';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';

import { ProductNotFoundError } from '../../../../domain/errors/product.error';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    private readonly productCommandRepo: IProductCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: DeleteProductCommand): Promise<{ productId: string }> {
    return await this.dataContext.runInTransaction(async () => {
      const productAggregate = await this.productCommandRepo.findById(command.productId);

      if (!productAggregate) {
        throw new ProductNotFoundError();
      }

      productAggregate.remove();

      await this.productCommandRepo.update(productAggregate);

      return {
        productId: productAggregate.id,
      };
    });
  }
}
