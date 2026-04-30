import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from './get-cart.query';
import { ICartQueryRepository } from '../../ports/repositories/cart-query.repo';
import { Cart } from '../../../domain/entities/cart.entity';

type GrpcTimestamp = {
  seconds: number;
  nanos: number;
};

const toTimestamp = (date?: Date | null): GrpcTimestamp | undefined => {
  if (!date) return undefined;

  const time = date instanceof Date ? date.getTime() : new Date(date).getTime();

  return {
    seconds: Math.floor(time / 1000),
    nanos: (time % 1000) * 1_000_000,
  };
};

export interface GetCartItemResult {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;
  skuSnapshot?: string;
  productThumbnailSnapshot?: string;
  imageVariantSnapshot?: string;
  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;
  attributesSnapshot: {
    name: string;
    value: string;
  }[];
  subtotal: number;
  createdAt?: GrpcTimestamp;
  updatedAt?: GrpcTimestamp;
}

export interface GetCartResult {
  id: string | null;
  userId?: string;
  sessionId?: string;
  currency?: string;
  status?: string;
  expiresAt?: GrpcTimestamp;
  items: GetCartItemResult[];
  totalItems: number;
  totalUniqueItems: number;
  subtotal: number;
  createdAt?: GrpcTimestamp;
  updatedAt?: GrpcTimestamp;
}

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery, GetCartResult> {
  constructor(private readonly cartQueryRepo: ICartQueryRepository) {}

  async execute(query: GetCartQuery): Promise<GetCartResult> {
    const { userId, sessionId } = query;

    if (!userId && !sessionId) {
      throw new Error('userId or sessionId is required');
    }

    let cart: Cart | null = null;

    if (userId) {
      cart = await this.cartQueryRepo.findByUserId(userId);
    } else if (sessionId) {
      cart = await this.cartQueryRepo.findBySessionId(sessionId);
    }

    if (!cart) {
      return {
        id: null,
        items: [],
        totalItems: 0,
        totalUniqueItems: 0,
        subtotal: 0,
      };
    }

    const items = cart.getItems().map((item) => ({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,

      productNameSnapshot: item.productNameSnapshot,
      productSlugSnapshot: item.productSlugSnapshot,
      variantNameSnapshot: item.variantNameSnapshot,

      skuSnapshot: item.skuSnapshot,
      productThumbnailSnapshot: item.productThumbnailSnapshot,
      imageVariantSnapshot: item.imageVariantSnapshot,

      unitPriceSnapshot: item.unitPriceSnapshot,
      compareAtPriceSnapshot: item.compareAtPriceSnapshot,

      attributesSnapshot: item.attributesSnapshot.map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),

      subtotal: item.subtotal,

      createdAt: toTimestamp(item.createdAt),
      updatedAt: toTimestamp(item.updatedAt),
    }));

    return {
      id: cart.id,
      userId: cart.userId,
      sessionId: cart.sessionId,
      currency: cart.currency,
      status: cart.status,
      expiresAt: toTimestamp(cart.expiresAt),

      items,

      totalItems: cart.totalItems,
      totalUniqueItems: cart.totalUniqueItems,
      subtotal: cart.subtotal,

      createdAt: toTimestamp(cart.createdAt),
      updatedAt: toTimestamp(cart.updatedAt),
    };
  }
}
