import { Observable } from 'rxjs';
import {
  CheckoutCartRequest,
  CheckoutCartResponse,
  CheckoutCartResult,
} from '../../application/ports/contracts/cart.contract';

export interface ICartGrpcService {
  getCartForCheckout(data: { userId: string }): Observable<CheckoutCartResult>;

  checkoutCart(data: CheckoutCartRequest): Observable<CheckoutCartResponse>;
}
