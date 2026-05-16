import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCartItemsCommand } from './remove-cart-items.command';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';

import {
  CartItemNotFoundError,
  CartUserOrSessionRequiredError,
  UserRequired,
} from '../../../domain/errors/cart.error';

@CommandHandler(RemoveCartItemsCommand)
export class RemoveCartItemsHandler implements ICommandHandler<RemoveCartItemsCommand, void> {
  constructor(
    private readonly cartRepository: ICartCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: RemoveCartItemsCommand): Promise<void> {
    const { cartItemIds, userId, sessionId } = command;

    if (!userId && !sessionId) {
      throw new CartUserOrSessionRequiredError();
    }

    if (cartItemIds.length === 0) {
      return;
    }

    return this.dataContext.runInTransaction(async () => {
      const cart = await this.cartRepository.findByCartItemId(cartItemIds[0]);

      if (!cart) {
        throw new CartItemNotFoundError();
      }

      if (userId) {
        if (cart.userId !== userId) {
          throw new UserRequired();
        }
      } else {
        if (!sessionId || cart.sessionId !== sessionId) {
          throw new UserRequired();
        }
      }

      for (const cartItemId of cartItemIds) {
        const existedItem = cart.getItemById(cartItemId);

        if (!existedItem) {
          continue;
        }

        cart.removeItem(cartItemId);
      }

      await this.cartRepository.save(cart);
    });
  }
}
