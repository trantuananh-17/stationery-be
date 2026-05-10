import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export interface CustomerOrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  shippingProvider?: string;
  shippingAddress: OrderAddressGrpc;
  items: OrderDetailItemGrpc[];
  totalItems: number;
  totalUniqueItems: number;

  estimatedDelivery?: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
}

export interface CustomerOrderDetailGrpc {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  shippingProvider?: string;
  shippingAddress: OrderAddressGrpc;
  items: OrderDetailItemGrpc[];
  totalItems: number;
  totalUniqueItems: number;

  estimatedDelivery?: GrpcTimestamp;
  paidAt?: GrpcTimestamp;
  shippedAt?: GrpcTimestamp;
  deliveredAt?: GrpcTimestamp;
  cancelledAt?: GrpcTimestamp;
  createdAt: GrpcTimestamp;
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
