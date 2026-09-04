export class CouponInputDto {
  code: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  /** ISO string qua gRPC; handler tự chuyển sang Date. */
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export class GetCouponsDto {
  search?: string;
  page?: number;
  limit?: number;
}

export class UpdateCouponDto {
  couponId: string;
  input: CouponInputDto;
}

export class CouponIdDto {
  couponId: string;
}

export class ValidateCouponDto {
  code: string;
  subtotal: number;
}
