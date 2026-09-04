export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  EXPIRED: 'EXPIRED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
