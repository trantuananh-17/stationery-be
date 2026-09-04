import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IWishlistRepository } from '../../../ports/repositories/wishlist.repo';
import { RemoveWishlistItemCommand } from './remove-wishlist-item.command';

@CommandHandler(RemoveWishlistItemCommand)
export class RemoveWishlistItemHandler implements ICommandHandler<RemoveWishlistItemCommand> {
  constructor(private readonly wishlistRepo: IWishlistRepository) {}

  async execute(command: RemoveWishlistItemCommand) {
    const { userId, productId } = command;

    await this.wishlistRepo.remove(userId, productId);

    return { productId };
  }
}
