export const CouponType = {
  /** Giảm theo phần trăm giá trị đơn, có thể chặn trần bằng maxDiscount. */
  PERCENT: 'PERCENT',
  /** Giảm số tiền cố định. */
  FIXED: 'FIXED',
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];
