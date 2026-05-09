import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export type CheckoutGrpcRequest = {
  userId: string;
  email: string;
  shippingAddress: CheckoutAddressGrpc;
  billingAddress: CheckoutAddressGrpc;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
};

export type CheckoutAddressGrpc = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  phone?: string;
};

export type CheckoutGrpcResponse = {
  success: boolean;

  code?: 'STOCK_RESERVATION_FAILED' | 'CART_EMPTY';
  message?: string;

  orderId?: string;
  orderNumber?: string;

  subtotal?: number;
  total?: number;

  status?: string;
  paymentStatus?: string;

  stockItems: CheckoutStockItemGrpc[];
};

export type CheckoutStockItemGrpc = {
  variantId: string;
  requestedQuantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';
  availableStock: number;
  remainingStock: number;
  message?: string;
};

export type GetOrdersAdminGrpcRequest = {
  search?: string;
  status?: string;
  orderby?: string;
  page?: number;
  limit?: number;
};

export type OrdersAdminGrpcResponse = {
  data: OrderItemByAdminGrpc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type OrderItemByAdminGrpc = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: string;
  paymentStatus: string;
  total: number;

  createdAt: GrpcTimestamp;
};

// Get Order
export interface GetOrderGrpcRequest {
  orderId: string;
}

export interface GetMyOrderGrpcRequest {
  orderId: string;
  userId: string;
}

export interface OrderDetailGrpcResponse {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentTransactionId?: string;
  paymentProvider?: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  shippingAddress: CheckoutAddressGrpc;
  billingAddress: CheckoutAddressGrpc;
  items: OrderItemGrpc[];
  totalItems: number;
  totalUniqueItems: number;
  paymentExpiredAt?: GrpcTimestamp;
  paidAt?: GrpcTimestamp;
  shippedAt?: GrpcTimestamp;
  deliveredAt?: GrpcTimestamp;
  cancelledAt?: GrpcTimestamp;
  estimatedDelivery?: GrpcTimestamp;
  createdAt: GrpcTimestamp;
  updatedAt: GrpcTimestamp;
}

export interface OrderItemGrpc {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
  attributes: OrderItemAttributeGrpc[];
}

export interface OrderItemAttributeGrpc {
  name: string;
  value: string;
}

export interface PaymentStatus {
  PENDING: 'PENDING';
  PAID: 'PAID';
  FAILED: 'FAILED';
  REFUNDED: 'REFUNDED';
}

export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
}
