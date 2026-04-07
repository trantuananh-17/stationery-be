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

  async findByCartItemId(cartItemId: string): Promise<Cart | null> {
    const cartOrm = await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .where((qb) => {
        const sub = qb
          .subQuery()
          .select('ci.cartId')
          .from(CartItemOrmEntity, 'ci')
          .where('ci.id = :cartItemId')
          .getQuery();

        return 'cart.id = ' + sub;
      })
      .setParameter('cartItemId', cartItemId)
      .getOne();

    if (!cartOrm) return null;

    return this._toDomain(cartOrm);
  }

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
    orm.userId = cart.userId ?? undefined;
    orm.sessionId = cart.sessionId ?? undefined;
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
    orm.skuSnapshot = item.skuSnapshot;
    orm.productThumbnailSnapshot = item.productThumbnailSnapshot;
    orm.imageVariantSnapshot = item.imageVariantSnapshot ?? undefined;
    orm.unitPriceSnapshot = item.unitPriceSnapshot;
    orm.compareAtPriceSnapshot = item.compareAtPriceSnapshot ?? undefined;
    orm.attributesSnapshot = item.attributesSnapshot;
    orm.createdAt = item.createdAt;
    orm.updatedAt = item.updatedAt;

    return orm;
  }

  private _toDomain(cartOrm: CartOrmEntity): Cart {
    return Cart.restore(
      {
        id: cartOrm.id,
        userId: cartOrm.userId ?? undefined,
        sessionId: cartOrm.sessionId ?? undefined,
        status: cartOrm.status,
        currency: cartOrm.currency,
        expiresAt: cartOrm.expiresAt ?? undefined,
        createdAt: cartOrm.createdAt,
        updatedAt: cartOrm.updatedAt,
      },
      (cartOrm.items ?? []).map((item) =>
        CartItem.restore({
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          productNameSnapshot: item.productNameSnapshot,
          productSlugSnapshot: item.productSlugSnapshot,
          variantNameSnapshot: item.variantNameSnapshot,
          skuSnapshot: item.skuSnapshot ?? undefined,
          productThumbnailSnapshot: item.productThumbnailSnapshot ?? undefined,
          imageVariantSnapshot: item.imageVariantSnapshot ?? undefined,
          unitPriceSnapshot: item.unitPriceSnapshot,
          compareAtPriceSnapshot: item.compareAtPriceSnapshot ?? undefined,
          attributesSnapshot: item.attributesSnapshot,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }),
      ),
    );
  }
}
