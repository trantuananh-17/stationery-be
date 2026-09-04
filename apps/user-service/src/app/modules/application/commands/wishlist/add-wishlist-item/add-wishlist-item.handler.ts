import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WishlistItem } from '../../../../domain/entities/wishlist-item.entity';
import { IWishlistRepository } from '../../../ports/repositories/wishlist.repo';
import { AddWishlistItemCommand } from './add-wishlist-item.command';

@CommandHandler(AddWishlistItemCommand)
export class AddWishlistItemHandler implements ICommandHandler<AddWishlistItemCommand> {
  constructor(private readonly wishlistRepo: IWishlistRepository) {}

  async execute(command: AddWishlistItemCommand) {
    const { userId, input } = command;

    // Thêm lại sản phẩm đã có thì coi như không làm gì — tránh lỗi unique
    // khi user bấm nhanh hai lần.
    const existed = await this.wishlistRepo.exists(userId, input.productId);

    if (existed) {
      return { productId: input.productId, added: false };
    }

    await this.wishlistRepo.save(WishlistItem.create(userId, input));

    return { productId: input.productId, added: true };
  }
}
