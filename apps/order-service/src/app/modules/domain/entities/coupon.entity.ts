import { CouponType } from '../enums/coupon-type.enum';
import {
  CouponExpiredError,
  CouponInactiveError,
  CouponMinOrderError,
  CouponUsageLimitError,
  InvalidCouponValueError,
} from '../errors/coupon.error';

export type CouponParams = {
  readonly id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  /** Trần giảm giá cho loại PERCENT; 0 = không chặn trần. */
  maxDiscount: number;
  startsAt?: Date;
  expiresAt?: Date;
  /** 0 = không giới hạn lượt dùng. */
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
};

export type CouponInput = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startsAt?: Date;
  expiresAt?: Date;
  usageLimit?: number;
  isActive?: boolean;
};

export class Coupon {
  constructor(private params: CouponParams) {}

  static create(input: CouponInput) {
    const now = new Date();

    const coupon = new Coupon({
      id: crypto.randomUUID(),
      code: input.code.trim().toUpperCase(),
      type: input.type,
      value: input.value,
      minOrderAmount: input.minOrderAmount ?? 0,
      maxDiscount: input.maxDiscount ?? 0,
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
      usageLimit: input.usageLimit ?? 0,
      usedCount: 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    coupon.validateValue();

    return coupon;
  }

  static restore(params: CouponParams) {
    return new Coupon(params);
  }

  update(input: CouponInput) {
    this.params.code = input.code.trim().toUpperCase();
    this.params.type = input.type;
    this.params.value = input.value;
    this.params.minOrderAmount = input.minOrderAmount ?? 0;
    this.params.maxDiscount = input.maxDiscount ?? 0;
    this.params.startsAt = input.startsAt;
    this.params.expiresAt = input.expiresAt;
    this.params.usageLimit = input.usageLimit ?? 0;
    this.params.isActive = input.isActive ?? true;
    this.params.updatedAt = new Date();

    this.validateValue();
  }

  private validateValue() {
    if (this.params.value <= 0) {
      throw new InvalidCouponValueError('Giá trị giảm phải lớn hơn 0');
    }

    if (this.params.type === CouponType.PERCENT && this.params.value > 100) {
      throw new InvalidCouponValueError('Giảm theo phần trăm không được vượt quá 100');
    }

    if (this.params.minOrderAmount < 0 || this.params.maxDiscount < 0) {
      throw new InvalidCouponValueError('Giá trị cấu hình không được âm');
    }
  }

  /** Ném lỗi domain nếu mã không dùng được cho giá trị đơn này. */
  assertUsableFor(subtotal: number, now = new Date()) {
    if (!this.params.isActive) {
      throw new CouponInactiveError();
    }

    if (this.params.startsAt && now < this.params.startsAt) {
      throw new CouponExpiredError();
    }

    if (this.params.expiresAt && now > this.params.expiresAt) {
      throw new CouponExpiredError();
    }

    if (this.params.usageLimit > 0 && this.params.usedCount >= this.params.usageLimit) {
      throw new CouponUsageLimitError();
    }

    if (subtotal < this.params.minOrderAmount) {
      throw new CouponMinOrderError(this.params.minOrderAmount);
    }
  }

  /** Số tiền giảm, đã chặn trần và không vượt quá giá trị đơn. */
  calculateDiscount(subtotal: number): number {
    const raw =
      this.params.type === CouponType.PERCENT
        ? (subtotal * this.params.value) / 100
        : this.params.value;

    const capped = this.params.maxDiscount > 0 ? Math.min(raw, this.params.maxDiscount) : raw;

    return Math.min(Math.round(capped), subtotal);
  }

  markUsed() {
    this.params.usedCount += 1;
    this.params.updatedAt = new Date();
  }

  get id(): string {
    return this.params.id;
  }

  get code(): string {
    return this.params.code;
  }

  get type(): CouponType {
    return this.params.type;
  }

  get value(): number {
    return this.params.value;
  }

  get minOrderAmount(): number {
    return this.params.minOrderAmount;
  }

  get maxDiscount(): number {
    return this.params.maxDiscount;
  }

  get startsAt(): Date | undefined {
    return this.params.startsAt;
  }

  get expiresAt(): Date | undefined {
    return this.params.expiresAt;
  }

  get usageLimit(): number {
    return this.params.usageLimit;
  }

  get usedCount(): number {
    return this.params.usedCount;
  }

  get isActive(): boolean {
    return this.params.isActive;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }
}
