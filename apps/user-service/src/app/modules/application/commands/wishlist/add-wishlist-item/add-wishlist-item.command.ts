import { ICommand } from '@nestjs/cqrs';

import { WishlistItemInput } from '../../../../domain/entities/wishlist-item.entity';

export class AddWishlistItemCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly input: WishlistItemInput,
  ) {}
}
