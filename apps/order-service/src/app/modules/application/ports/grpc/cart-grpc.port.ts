import { CheckoutCartResult } from '../contracts/cart.contract';

export abstract class ICartGrpcPort {
  abstract getCartForCheckout(data: { userId: string }): Promise<CheckoutCartResult>;
}
