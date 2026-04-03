import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartCountQuery } from './get-cart-count.query';
import { ICartQueryRepository } from '../../ports/repositories/cart-query.repo';
import { Cart } from '../../../domain/entities/cart.entity';

export interface GetCartCountResult {
  count: number;
}

@QueryHandler(GetCartCountQuery)
export class GetCartCountHandler implements IQueryHandler<GetCartCountQuery, GetCartCountResult> {
  constructor(private readonly cartQueryRepo: ICartQueryRepository) {}

  async execute(query: GetCartCountQuery): Promise<GetCartCountResult> {
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

    return {
      count: cart ? cart.totalItems : 0,
    };
  }
}
