import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';

@Entity({
  name: 'daily_metrics',
})
@Index('idx_daily_metrics_date', ['date'], {
  unique: true,
})
export class DailyMetricOrmEntity extends BaseEntity {
  @Column({
    type: 'date',
    unique: true,
  })
  date: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalRevenue: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  totalOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  completedOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  cancelledOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  refundedOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  totalCustomers: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  newCustomers: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  totalItemsSold: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  averageOrderValue: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  estimatedProfit: number;
}
