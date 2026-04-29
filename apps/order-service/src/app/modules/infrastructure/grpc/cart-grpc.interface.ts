import { Observable } from 'rxjs';
import { CheckoutCartResult } from '../../application/ports/contracts/cart.contract';

export interface ICartGrpcService {
  getCartForCheckout(data: { userId: string }): Observable<CheckoutCartResult>;
}
