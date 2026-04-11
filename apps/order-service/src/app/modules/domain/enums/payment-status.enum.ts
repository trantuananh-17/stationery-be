export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
