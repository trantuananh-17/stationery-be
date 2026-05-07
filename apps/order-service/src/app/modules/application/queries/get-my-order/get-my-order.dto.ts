import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export interface OrderDetailGrpcResponse {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  shippingAddress: OrderAddressGrpc;
  items: OrderDetailItemGrpc[];
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

export interface OrderAddressGrpc {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  phone?: string;
}

export interface OrderDetailItemGrpc {
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
