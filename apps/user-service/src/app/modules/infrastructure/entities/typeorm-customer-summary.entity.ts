import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { UserOrmEntity } from './typeorm-user.entity';

@Entity({ name: 'customer_summaries' })
export class CustomerSummaryOrmEntity extends BaseEntity {
  @Index()
  @Column({
    name: 'user_id',
    type: 'uuid',
    unique: true,
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Index()
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Index()
  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    name: 'total_orders',
    type: 'integer',
    default: 0,
  })
  totalOrders: number;

  @Column({
    name: 'amount_spent',
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  amountSpent: number;

  @Column({
    name: 'last_order_id',
    type: 'uuid',
    nullable: true,
  })
  lastOrderId?: string;

  @Column({
    name: 'last_order_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  lastOrderTotal?: number;

  @Column({
    name: 'last_order_at',
    type: 'timestamp',
    nullable: true,
  })
  lastOrderAt?: Date;

  @Column({
    name: 'customer_since',
    type: 'timestamp',
  })
  customerSince: Date;

  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
