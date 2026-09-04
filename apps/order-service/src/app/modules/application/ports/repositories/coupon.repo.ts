import { QueryResult } from '@common/interfaces/common/pagination.interface';

import { Coupon } from '../../../domain/entities/coupon.entity';

export abstract class ICouponRepository {
  abstract save(coupon: Coupon): Promise<void>;

  abstract findByCode(code: string): Promise<Coupon | null>;

  abstract findById(id: string): Promise<Coupon | null>;

  abstract findAll(filters: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<QueryResult<Coupon>>;

  abstract delete(id: string): Promise<boolean>;

  /** Tăng lượt dùng theo cách atomic, tôn trọng usageLimit; false = đã hết lượt. */
  abstract incrementUsage(id: string): Promise<boolean>;
}
