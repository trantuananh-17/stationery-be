import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

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

export interface OrderPaymentDto {
  orderId: string;
  orderNumber: string;
  userId: string;
  email: string;
  totalItems: number;
  lineItems: OrderPaymentLineItemDto[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentExpiredAt?: Date;
}
