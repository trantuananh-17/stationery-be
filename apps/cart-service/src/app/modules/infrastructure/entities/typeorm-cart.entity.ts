import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { StatusCart } from '../../domain/enums/status-cart.enum';
import { CartItemOrmEntity } from './typeorm-cart-item.entity';

@Entity({ name: 'carts' })
export class CartOrmEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId?: string;

  @Column({ type: 'enum', enum: StatusCart, default: StatusCart.ACTIVE })
  status: StatusCart;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @OneToMany(() => CartItemOrmEntity, (item) => item.cart)
  items: CartItemOrmEntity[];
}
