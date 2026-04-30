import { Observable } from 'rxjs';

import {
  RemoveCartItemRequest,
  AddToCartRequest,
  ClearCartRequest,
  GetCartCountRequest,
  GetCartCountResponse,
  GetCartForCheckoutRequest,
  GetCartForCheckoutResponse,
  GetCartRequest,
  GetCartResponse,
  MergeCartRequest,
  UpdateCartItemQuantityRequest,
} from '../../applications/ports/dtos/cart.dto';

export interface CartGrpcService {
  getCart(data: GetCartRequest): Observable<GetCartResponse>;

  getCartCount(data: GetCartCountRequest): Observable<GetCartCountResponse>;

  getCartForCheckout(data: GetCartForCheckoutRequest): Observable<GetCartForCheckoutResponse>;

  addToCart(data: AddToCartRequest): Observable<GetCartResponse>;

  updateCartItemQuantity(data: UpdateCartItemQuantityRequest): Observable<GetCartResponse>;

  removeCartItem(data: RemoveCartItemRequest): Observable<GetCartResponse>;

  clearCart(data: ClearCartRequest): Observable<GetCartResponse>;

  mergeCart(data: MergeCartRequest): Observable<GetCartResponse>;
}
