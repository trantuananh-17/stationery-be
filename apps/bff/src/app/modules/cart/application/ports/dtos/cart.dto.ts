export interface PingResponse {
  message: string;
}

export interface GetCartRequest {
  userId?: string;
  sessionId?: string;
}

export interface GetCartCountRequest {
  userId?: string;
  sessionId?: string;
}

export interface GetCartCountResponse {
  count: number;
}

export interface AddToCartRequest {
  userId?: string;
  sessionId?: string;
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemQuantityRequest {
  userId?: string;
  sessionId?: string;
  variantId: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  userId?: string;
  sessionId?: string;
  cartItemId: string;
}

export interface ClearCartRequest {
  userId?: string;
  sessionId?: string;
}

export interface MergeCartRequest {
  userId: string;
  sessionId: string;
}

export interface CartAttribute {
  name: string;
  value: string;
}

export interface CartItem {
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

  attributesSnapshot: CartAttribute[];

  subtotal: number;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GetCartResponse {
  id?: string | null;
  userId?: string;
  sessionId?: string;

  currency?: string;
  status?: string;
  expiresAt?: Date | string;

  items: CartItem[];

  totalItems: number;
  totalUniqueItems: number;
  subtotal: number;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface GetCartForCheckoutRequest {
  userId: string;
}

export interface CheckoutCartAttribute {
  name: string;
  value: string;
}

export interface CheckoutCartItem {
  productId: string;
  variantId: string;
  quantity: number;

  productNameSnapshot: string;
  variantNameSnapshot: string;

  skuSnapshot?: string;
  imageSnapshot?: string;

  unitPriceSnapshot: number;

  attributesSnapshot: CheckoutCartAttribute[];

  subtotal: number;
}

export interface GetCartForCheckoutResponse {
  id: string;
  userId: string;

  items: CheckoutCartItem[];

  totalItems: number;
  subtotal: number;
}
