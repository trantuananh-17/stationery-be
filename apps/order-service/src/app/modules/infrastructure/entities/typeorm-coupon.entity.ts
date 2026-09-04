import { BaseEntity } from '@common/databases/base.entity';
import { Column, Entity, Index } from 'typeorm';

import { CouponType } from '../../domain/enums/coupon-type.enum';

@Entity({ name: 'coupons' })
export class CouponOrmEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  type: CouponType;

  @Column({ type: 'decimal' })
  value: number;

  @Column({ name: 'min_order_amount', type: 'decimal', default: 0 })
  minOrderAmount: number;

  @Column({ name: 'max_discount', type: 'decimal', default: 0 })
  maxDiscount: number;

  @Column({ name: 'starts_at', type: 'timestamp', nullable: true })
  startsAt?: Date | null;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({ name: 'usage_limit', type: 'int', default: 0 })
  usageLimit: number;

  @Column({ name: 'used_count', type: 'int', default: 0 })
  usedCount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
