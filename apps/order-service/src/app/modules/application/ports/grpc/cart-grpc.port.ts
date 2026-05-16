import {
  CheckoutCartRequest,
  CheckoutCartResponse,
  CheckoutCartResult,
} from '../contracts/cart.contract';

export abstract class ICartGrpcPort {
  abstract getCartForCheckout(data: { userId: string }): Promise<CheckoutCartResult>;
  abstract checkoutCart(data: CheckoutCartRequest): Promise<CheckoutCartResponse>;
}
