export class SyncLastOrderItemAttributeDto {
  name: string;
  value: string;
}

export class SyncLastOrderItemDto {
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  thumbnail?: string;
  quantity: number;
  price: number;
  subtotal: number;
  attributes: SyncLastOrderItemAttributeDto[];
}

export class SyncLastOrderDto {
  userId: string;
  orderId: string;
  orderNumber: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  orderedAt: Date;
  items: SyncLastOrderItemDto[];
}

export class SyncCustomerSummaryDto {
  userId: string;
  email: string;
  isActive?: boolean;
  isVerified?: boolean;
  amountSpentIncrement?: number;
  totalOrdersIncrement?: number;
  lastOrderId?: string;
  lastOrderTotal?: number;
  lastOrderAt?: Date;
}
