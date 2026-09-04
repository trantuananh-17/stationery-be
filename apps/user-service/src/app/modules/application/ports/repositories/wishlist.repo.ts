import { WishlistItem } from '../../../domain/entities/wishlist-item.entity';

export abstract class IWishlistRepository {
  abstract findByUser(userId: string): Promise<WishlistItem[]>;

  abstract exists(userId: string, productId: string): Promise<boolean>;

  abstract save(item: WishlistItem): Promise<void>;

  abstract remove(userId: string, productId: string): Promise<boolean>;
}
