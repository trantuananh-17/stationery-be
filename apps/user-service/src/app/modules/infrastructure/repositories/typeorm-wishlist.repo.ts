import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IWishlistRepository } from '../../application/ports/repositories/wishlist.repo';
import { WishlistItem } from '../../domain/entities/wishlist-item.entity';
import { WishlistItemOrmEntity } from '../entities/typeorm-wishlist-item.entity';

@Injectable()
export class TypeOrmWishlistRepository implements IWishlistRepository {
  constructor(
    @InjectRepository(WishlistItemOrmEntity)
    private readonly repo: Repository<WishlistItemOrmEntity>,
  ) {}

  async findByUser(userId: string): Promise<WishlistItem[]> {
    const rows = await this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });

    return rows.map((row) =>
      WishlistItem.restore({
        id: row.id,
        userId: row.userId,
        productId: row.productId,
        productName: row.productName,
        productSlug: row.productSlug,
        thumbnail: row.thumbnail,
        price: Number(row.price),
        createdAt: row.createdAt,
      }),
    );
  }

  async exists(userId: string, productId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { userId, productId } });

    return count > 0;
  }

  async save(item: WishlistItem): Promise<void> {
    await this.repo.save({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      thumbnail: item.thumbnail,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
    });
  }

  async remove(userId: string, productId: string): Promise<boolean> {
    const result = await this.repo.delete({ userId, productId });

    return !!result.affected;
  }
}
