import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../create-product.command';
import { Product } from '../../../domain/entities/product.entity';
import { IProductCommandRepository } from '../../ports/product-command.repo';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly repo: IProductCommandRepository) {}

  async execute(command: CreateProductCommand) {
    const { name, categoryId } = command;

    const product = Product.create(name, categoryId);

    await this.repo.create(product);

    return { id: product.id };
  }
}
