export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  EXPIRED: 'EXPIRED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
