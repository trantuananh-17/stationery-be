import { BaseError } from './base.error';

export class CouponNotFoundError extends BaseError {
  constructor(code: string) {
    super('COUPON_NOT_FOUND', `Mã giảm giá không tồn tại: ${code}`);
  }
}

export class CouponInactiveError extends BaseError {
  constructor() {
    super('COUPON_INACTIVE', 'Mã giảm giá đã bị vô hiệu hoá');
  }
}

export class CouponExpiredError extends BaseError {
  constructor() {
    super('COUPON_EXPIRED', 'Mã giảm giá đã hết hạn hoặc chưa tới ngày áp dụng');
  }
}

export class CouponUsageLimitError extends BaseError {
  constructor() {
    super('COUPON_USAGE_LIMIT', 'Mã giảm giá đã hết lượt sử dụng');
  }
}

export class CouponMinOrderError extends BaseError {
  constructor(minOrderAmount: number) {
    super('COUPON_MIN_ORDER', `Đơn hàng phải từ ${minOrderAmount} mới dùng được mã này`);
  }
}

export class CouponCodeExistsError extends BaseError {
  constructor(code: string) {
    super('COUPON_CODE_EXISTS', `Mã giảm giá đã tồn tại: ${code}`);
  }
}

export class InvalidCouponValueError extends BaseError {
  constructor(message: string) {
    super('INVALID_COUPON_VALUE', message);
  }
}
