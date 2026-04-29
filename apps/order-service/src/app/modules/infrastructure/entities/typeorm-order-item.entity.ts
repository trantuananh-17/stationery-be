import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { OrderOrmEntity } from './typeorm-order.entity';

@Entity({ name: 'order_items' })
export class OrderItemOrmEntity extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderOrmEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderOrmEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku?: string | null;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  subtotal: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  attributes: {
    name: string;
    value: string;
  }[];
}
