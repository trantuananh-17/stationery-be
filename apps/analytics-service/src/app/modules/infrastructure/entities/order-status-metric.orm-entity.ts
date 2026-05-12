import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';

@Entity({
  name: 'order_status_metrics',
})
@Index('idx_order_status_metrics_bucket_date', ['bucketDate'], {
  unique: true,
})
export class OrderStatusMetricOrmEntity extends BaseEntity {
  @Column({
    type: 'date',
    unique: true,
  })
  bucketDate: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  pendingOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  processingOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  shippedOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  deliveredOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  cancelledOrders: number;
}
