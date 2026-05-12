import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';

@Entity({
  name: 'sales_performance',
})
@Index('idx_sales_performance_bucket_date', ['bucketDate'], {
  unique: true,
})
export class SalesPerformanceOrmEntity extends BaseEntity {
  @Column({
    type: 'date',
    unique: true,
  })
  bucketDate: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  revenue: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  orders: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  estimatedProfit: number;
}
