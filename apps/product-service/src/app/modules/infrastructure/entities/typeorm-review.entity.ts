import { BaseEntity } from '@common/databases/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { ProductOrmEntity } from './typeorm-product.entity';

@Entity({ name: 'reviews' })
@Index(['productId'])
@Unique(['productId', 'userId'])
export class ReviewOrmEntity extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'user_name', type: 'varchar', length: 200 })
  userName: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;
}
