import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { ProductOrmEntity } from './typeorm-product.entity';
import { VariantAttributeOrmEntity } from './typeorm-variant-attribute.entity';

@Entity({ name: 'variants' })
export class VariantOrmEntity extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { name: 'compare_at_price', nullable: true })
  compareAtPrice?: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('int', { default: 0 })
  reservedStock: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ name: 'deleted_at', default: null, nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => ProductOrmEntity, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @OneToMany(() => VariantAttributeOrmEntity, (attr) => attr.variant)
  attributes: VariantAttributeOrmEntity[];
}
