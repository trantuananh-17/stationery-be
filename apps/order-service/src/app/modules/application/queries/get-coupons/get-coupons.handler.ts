import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Coupon } from '../../../domain/entities/coupon.entity';
import { ICouponRepository } from '../../ports/repositories/coupon.repo';
import { GetCouponsQuery } from './get-coupons.query';

export type CouponDto = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startsAt?: Date;
  expiresAt?: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
};

export type GetCouponsResult = PaginatedResult<CouponDto>;

export const toCouponDto = (coupon: Coupon): CouponDto => ({
  id: coupon.id,
  code: coupon.code,
  type: coupon.type,
  value: coupon.value,
  minOrderAmount: coupon.minOrderAmount,
  maxDiscount: coupon.maxDiscount,
  startsAt: coupon.startsAt,
  expiresAt: coupon.expiresAt,
  usageLimit: coupon.usageLimit,
  usedCount: coupon.usedCount,
  isActive: coupon.isActive,
});

@QueryHandler(GetCouponsQuery)
export class GetCouponsHandler implements IQueryHandler<GetCouponsQuery, GetCouponsResult> {
  constructor(private readonly couponRepo: ICouponRepository) {}

  async execute(query: GetCouponsQuery): Promise<GetCouponsResult> {
    const { search, page, limit } = query;

    const result = await this.couponRepo.findAll({ search, page, limit });

    return {
      data: result.items.map(toCouponDto),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
