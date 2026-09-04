import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CouponNotFoundError } from '../../../domain/errors/coupon.error';
import { ICouponRepository } from '../../ports/repositories/coupon.repo';
import { ValidateCouponQuery } from './validate-coupon.query';

export type ValidateCouponResult = {
  code: string;
  type: string;
  discount: number;
};

@QueryHandler(ValidateCouponQuery)
export class ValidateCouponHandler
  implements IQueryHandler<ValidateCouponQuery, ValidateCouponResult>
{
  constructor(private readonly couponRepo: ICouponRepository) {}

  async execute(query: ValidateCouponQuery): Promise<ValidateCouponResult> {
    const { code, subtotal } = query;

    const coupon = await this.couponRepo.findByCode(code);

    if (!coupon) {
      throw new CouponNotFoundError(code);
    }

    // Ném lỗi domain nếu hết hạn / chưa đủ điều kiện / hết lượt.
    coupon.assertUsableFor(subtotal);

    return {
      code: coupon.code,
      type: coupon.type,
      discount: coupon.calculateDiscount(subtotal),
    };
  }
}
