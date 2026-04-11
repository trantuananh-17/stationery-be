import { Injectable } from '@nestjs/common';
import { CartOrmEntity } from '../entities/typeorm-cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemOrmEntity } from '../entities/typeorm-cart-item.entity';
import { ICartQueryRepository } from '../../application/ports/repositories/cart-query.repo';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { StatusCart } from '../../domain/enums/status-cart.enum';
import {
  CheckoutCartItemResult,
  CheckoutCartResult,
} from '../../application/dtos/checkout-cart.result';

@Injectable()
export class TypeOrmCartQueryRepository implements ICartQueryRepository {
  constructor(
    @InjectRepository(CartOrmEntity)
    private readonly cartRepo: Repository<CartOrmEntity>,
  ) {}
  async findCartInfoByCheckout(userId: string): Promise<CheckoutCartResult | null> {
    const cart = await this.cartRepo.findOne({
      where: {
        userId,
        status: StatusCart.ACTIVE,
      },
      relations: ['items'],
      order: {
        updatedAt: 'DESC',
        items: {
          createdAt: 'ASC',
        },
      },
    });

    if (!cart) {
      return null;
    }

    const items: CheckoutCartItemResult[] = (cart.items ?? []).map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      productNameSnapshot: item.productNameSnapshot,
      variantNameSnapshot: item.variantNameSnapshot,
      skuSnapshot: item.skuSnapshot ?? undefined,
      imageSnapshot: item.imageVariantSnapshot ?? item.productThumbnailSnapshot ?? undefined,
      unitPriceSnapshot: item.unitPriceSnapshot,
      attributesSnapshot: item.attributesSnapshot ?? [],
      subtotal: item.unitPriceSnapshot * item.quantity,
    }));

    return {
      id: cart.id,
      userId,
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
    };
  }

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.cartRepo.findOne({
      where: {
        id,
        status: StatusCart.ACTIVE,
      },
      relations: ['items'],
    });

    if (!cart) return null;

    return this._toDomain(cart);
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.cartRepo.findOne({
      where: {
        userId,
        status: StatusCart.ACTIVE,
      },
      relations: ['items'],
      order: {
        updatedAt: 'DESC',
      },
    });

    if (!cart) return null;

    return this._toDomain(cart);
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    const cart = await this.cartRepo.findOne({
      where: {
        sessionId,
        status: StatusCart.ACTIVE,
      },
      relations: ['items'],
      order: {
        updatedAt: 'DESC',
      },
    });

    if (!cart) return null;

    return this._toDomain(cart);
  }

  private _toDomain(cartOrm: CartOrmEntity): Cart {
    const items = (cartOrm.items ?? []).map((item) => this._toCartItemDomain(item));

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
      items,
    );
  }

  private _toCartItemDomain(item: CartItemOrmEntity): CartItem {
    return CartItem.restore({
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
    });
  }
}
