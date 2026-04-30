import {
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
  RemoveCartItemRequest,
} from '../../../cart/applications/ports/dtos/cart.dto';

export abstract class CartPort {
  abstract getCart(data: GetCartRequest): Promise<GetCartResponse>;

  abstract getCartCount(data: GetCartCountRequest): Promise<GetCartCountResponse>;

  abstract getCartForCheckout(data: GetCartForCheckoutRequest): Promise<GetCartForCheckoutResponse>;

  abstract addToCart(data: AddToCartRequest): Promise<GetCartResponse>;

  abstract updateCartItemQuantity(data: UpdateCartItemQuantityRequest): Promise<GetCartResponse>;

  abstract removeCartItem(data: RemoveCartItemRequest): Promise<GetCartResponse>;

  abstract clearCart(data: ClearCartRequest): Promise<GetCartResponse>;

  abstract mergeCart(data: MergeCartRequest): Promise<GetCartResponse>;
}
