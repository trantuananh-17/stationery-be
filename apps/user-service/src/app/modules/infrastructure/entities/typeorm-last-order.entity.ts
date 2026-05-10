import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { UserOrmEntity } from './typeorm-user.entity';

@Entity({
  name: 'last_order',
})
export class LastOrderOrmEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'order_id',
    type: 'uuid',
  })
  orderId: string;

  @Column({
    name: 'order_number',
    type: 'varchar',
    length: 50,
  })
  orderNumber: string;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  totalPrice: number;

  @Column({
    name: 'order_status',
    type: 'varchar',
    length: 50,
  })
  orderStatus: string;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 50,
  })
  paymentStatus: string;

  @Column({
    name: 'ordered_at',
    type: 'timestamp',
  })
  orderedAt: Date;

  @Column({
    type: 'jsonb',
  })
  items: {
    productId: string;

    variantId?: string;

    name: string;

    sku?: string;

    thumbnail?: string;

    quantity: number;

    price: number;

    subtotal: number;

    attributes: {
      name: string;
      value: string;
    }[];
  }[];

  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
