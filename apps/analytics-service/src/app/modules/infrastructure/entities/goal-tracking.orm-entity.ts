import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';

@Entity({
  name: 'goal_tracking',
})
@Index('idx_goal_tracking_bucket_month', ['bucketMonth'], {
  unique: true,
})
export class GoalTrackingOrmEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 7,
    unique: true,
  })
  bucketMonth: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  revenueGoal: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  currentRevenue: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  ordersGoal: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  currentOrders: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  customersGoal: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  currentCustomers: number;
}
