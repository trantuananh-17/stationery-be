import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';
import { RecentTransactionStatus } from '../../domain/entities/recent-transaction.entity';

@Entity({
  name: 'recent_transactions',
})
@Index('idx_recent_transactions_ordered_at', ['orderedAt'])
@Index('idx_recent_transactions_order_id', ['orderId'], {
  unique: true,
})
export class RecentTransactionOrmEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    unique: true,
  })
  orderId: string;

  @Column({
    type: 'uuid',
  })
  customerId: string;

  @Column({
    type: 'varchar',
  })
  customerName: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    type: 'integer',
  })
  totalItems: number;

  @Column({
    type: 'enum',
    enum: RecentTransactionStatus,
  })
  status: RecentTransactionStatus;

  @Column({
    type: 'timestamp',
  })
  orderedAt: Date;
}
