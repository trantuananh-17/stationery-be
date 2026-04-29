import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { OrderItemOrmEntity } from './typeorm-order-item.entity';

@Entity({ name: 'orders' })
export class OrderOrmEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  number: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };

  @Column({ name: 'billing_address', type: 'jsonb' })
  billingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_transaction_id', type: 'varchar', length: 100, nullable: true })
  paymentTransactionId?: string | null;

  @Column({ name: 'payment_provider', type: 'varchar', length: 50, nullable: true })
  paymentProvider?: string | null;

  @Column({ type: 'int' })
  subtotal: number;

  @Column({ type: 'int', default: 0 })
  tax: number;

  @Column({ name: 'shipping_cost', type: 'int', default: 0 })
  shippingCost: number;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'tracking_number', type: 'varchar', length: 100, nullable: true })
  trackingNumber?: string | null;

  @Column({ name: 'shipping_provider', type: 'varchar', length: 50, nullable: true })
  shippingProvider?: string | null;

  @Column({ name: 'estimated_delivery', type: 'timestamp', nullable: true })
  estimatedDelivery?: Date | null;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order)
  items: OrderItemOrmEntity[];
}
