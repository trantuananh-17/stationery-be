import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ICartQueryRepository } from '../../ports/repositories/cart-query.repo';
import { GetCartCheckoutQuery } from './get-cart-checkout.query';
import { CheckoutCartResult } from '../../dtos/checkout-cart.result';

@QueryHandler(GetCartCheckoutQuery)
export class GetCartCheckoutHandler
  implements IQueryHandler<GetCartCheckoutQuery, CheckoutCartResult | null>
{
  constructor(private readonly cartQueryRepo: ICartQueryRepository) {}

  async execute(query: GetCartCheckoutQuery): Promise<CheckoutCartResult | null> {
    const { userId } = query;

    if (!userId) {
      throw new Error('userId is required');
    }

    const cart = await this.cartQueryRepo.findCartInfoByCheckout(userId);

    if (!cart) return null;

    return cart;
  }
}
