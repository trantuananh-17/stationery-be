import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@common/databases/base.entity';

@Entity({
  name: 'product_performance',
})
@Index('idx_product_performance_product_date', ['productId', 'bucketDate'], {
  unique: true,
})
export class ProductPerformanceOrmEntity extends BaseEntity {
  @Column({
    type: 'date',
  })
  bucketDate: string;

  @Column({
    type: 'uuid',
  })
  productId: string;

  @Column({
    type: 'varchar',
  })
  productName: string;

  @Column({
    type: 'uuid',
  })
  categoryId: string;

  @Column({
    type: 'varchar',
  })
  categoryName: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  quantitySold: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalRevenue: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  estimatedProfit: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  totalOrders: number;
}
