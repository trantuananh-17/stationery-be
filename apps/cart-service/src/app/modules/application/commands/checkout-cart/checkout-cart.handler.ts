// checkout-cart.handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CheckoutCartCommand } from './checkout-cart.command';

import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';

import { Cart } from '../../../domain/entities/cart.entity';

import { CartNotFoundError, UserRequired } from '../../../domain/errors/cart.error';

@CommandHandler(CheckoutCartCommand)
export class CheckoutCartHandler
  implements ICommandHandler<CheckoutCartCommand, { cartId: string }>
{
  constructor(
    private readonly cartRepository: ICartCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: CheckoutCartCommand): Promise<{ cartId: string }> {
    const { userId } = command;

    if (!userId) {
      throw new UserRequired();
    }

    return this.dataContext.runInTransaction(async () => {
      const cart = await this.cartRepository.findActiveByUserId(userId);

      if (!cart) {
        throw new CartNotFoundError();
      }

      cart.checkout();

      await this.cartRepository.save(cart);

      return {
        cartId: cart.id,
      };
    });
  }
}
