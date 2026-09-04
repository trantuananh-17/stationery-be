import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WishlistItem } from '../../../domain/entities/wishlist-item.entity';
import { IWishlistRepository } from '../../ports/repositories/wishlist.repo';
import { GetWishlistQuery } from './get-wishlist.query';

@QueryHandler(GetWishlistQuery)
export class GetWishlistHandler implements IQueryHandler<GetWishlistQuery> {
  constructor(private readonly wishlistRepo: IWishlistRepository) {}

  execute(query: GetWishlistQuery): Promise<WishlistItem[]> {
    return this.wishlistRepo.findByUser(query.userId);
  }
}
