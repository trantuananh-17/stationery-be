import { getManager } from '@common/utils/get-manager.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICartCommandRepository } from '../../application/ports/repositories/cart-command.repo';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItemOrmEntity } from '../entities/typeorm-cart-item.entity';
import { CartOrmEntity } from '../entities/typeorm-cart.entity';

@Injectable()
export class TypeOrmCartCommandRepository implements ICartCommandRepository {
  constructor(
    @InjectRepository(CartOrmEntity)
    private readonly cartRepo: Repository<CartOrmEntity>,

    @InjectRepository(CartItemOrmEntity)
    private readonly cartItemRepo: Repository<CartItemOrmEntity>,
  ) {}

  async save(cart: Cart): Promise<void> {
    const manager = getManager();

    const cartRepo = manager ? manager.getRepository(CartOrmEntity) : this.cartRepo;
    const cartItemRepo = manager ? manager.getRepository(CartItemOrmEntity) : this.cartItemRepo;

    const cartOrm = this._toCartOrm(cart);
    const itemOrms = cart.getItems().map((item) => this._toCartItemOrm(item));

    await cartRepo.save(cartOrm);
    await this.syncCartItems(cart.id, itemOrms, cartItemRepo);
  }

  private async syncCartItems(
    cartId: string,
    nextItems: CartItemOrmEntity[],
    cartItemRepo: Repository<CartItemOrmEntity>,
  ): Promise<void> {
    const existingItems = await cartItemRepo.find({
      where: { cartId },
      select: ['id'],
    });

    const nextItemIds = new Set(nextItems.map((item) => item.id));
    const itemIdsToDelete = existingItems
      .filter((item) => !nextItemIds.has(item.id))
      .map((item) => item.id);

    if (nextItems.length > 0) {
      await cartItemRepo.save(nextItems);
    }

    if (itemIdsToDelete.length > 0) {
      await cartItemRepo.delete(itemIdsToDelete);
    }
  }

  private _toCartOrm(cart: Cart): CartOrmEntity {
    const orm = new CartOrmEntity();

    orm.id = cart.id;
    orm.userId = cart.userId ?? null;
    orm.sessionId = cart.sessionId ?? null;
    orm.status = cart.status;
    orm.currency = cart.currency;
    orm.expiresAt = cart.expiresAt ?? null;
    orm.createdAt = cart.createdAt;
    orm.updatedAt = cart.updatedAt;

    return orm;
  }

  private _toCartItemOrm(item: CartItem): CartItemOrmEntity {
    const orm = new CartItemOrmEntity();

    orm.id = item.id;
    orm.cartId = item.cartId;
    orm.productId = item.productId;
    orm.variantId = item.variantId;
    orm.quantity = item.quantity;
    orm.productNameSnapshot = item.productNameSnapshot;
    orm.productSlugSnapshot = item.productSlugSnapshot;
    orm.variantNameSnapshot = item.variantNameSnapshot;
    orm.skuSnapshot = item.skuSnapshot ?? null;
    orm.productThumbnailSnapshot = item.productThumbnailSnapshot ?? null;
    orm.imageVariantSnapshot = item.imageVariantSnapshot ?? null;
    orm.unitPriceSnapshot = item.unitPriceSnapshot;
    orm.compareAtPriceSnapshot = item.compareAtPriceSnapshot ?? null;
    orm.attributesSnapshot = item.attributesSnapshot;
    orm.createdAt = item.createdAt;
    orm.updatedAt = item.updatedAt;

    return orm;
  }
}
