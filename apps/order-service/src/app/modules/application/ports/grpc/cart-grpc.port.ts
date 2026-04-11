import { CheckoutCartItemResult } from '../contracts/cart.contract';

export abstract class ICartGrpcPort {
  abstract getCartForCheckout(userId: string): Promise<CheckoutCartItemResult>;
}
