export interface OrderPaymentLineItemDto {
  productId: string;
  variantId?: string | null;
  name: string;
  sku?: string | null;
  image?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderPaymentResponse {
  orderId: string;
  orderNumber: string;
  userId: string;
  email: string;
  totalItems: number;
  lineItems: OrderPaymentLineItemDto[];
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentExpiredAt?: Date;
}

export interface OrderPaymentGrpcRequest {
  userId: string;
  orderId: string;
}
