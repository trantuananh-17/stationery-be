import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IProductCommandRepository } from '../../../ports/repositories/product-command.repo';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';

import { ProductNotFoundError } from '../../../../domain/errors/product.error';
import { RestoreProductCommand } from './restore-product.handler';

@CommandHandler(RestoreProductCommand)
export class RestoreProductHandler implements ICommandHandler<RestoreProductCommand> {
  constructor(
    private readonly productCommandRepo: IProductCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: RestoreProductCommand): Promise<{ productId: string }> {
    return this.dataContext.runInTransaction(async () => {
      const productAggregate = await this.productCommandRepo.findById(command.productId);

      if (!productAggregate) {
        throw new ProductNotFoundError();
      }

      productAggregate.restore();

      await this.productCommandRepo.update(productAggregate);

      return {
        productId: productAggregate.id,
      };
    });
  }
}
