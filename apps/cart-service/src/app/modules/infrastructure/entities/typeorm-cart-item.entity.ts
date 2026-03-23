import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { CartOrmEntity } from './typeorm-cart.entity';

@Entity({ name: 'cart_items' })
export class CartItemOrmEntity extends BaseEntity {
  @Column({ name: 'cart_id', type: 'uuid' })
  cartId: string;

  @ManyToOne(() => CartOrmEntity)
  @JoinColumn({ name: 'cart_id' })
  cart: CartOrmEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'variant_id', type: 'uuid' })
  variantId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'product_name_snapshot' })
  productNameSnapshot: string;

  @Column({ name: 'variant_slug_snapshot' })
  productSlugSnapshot: string;

  @Column({ name: 'variant_name_snapshot' })
  variantNameSnapshot: string;

  @Column({ name: 'sku_snapshot' })
  skuSnapshot: string;

  @Column({ name: 'product_thumbnail_snapshot' })
  productThumbnailSnapshot: string;

  @Column({ name: 'image-variant-snapshot', nullable: true })
  imageVariantSnapshot?: string;

  @Column('decimal', { name: 'unit_price_snapshot' })
  unitPriceSnapshot: number;

  @Column('decimal', { name: 'compare_at_price_snapshot', nullable: true })
  compareAtPriceSnapshot?: number;

  @Column({
    name: 'attributes_snapshot',
    type: 'jsonb',
    default: () => "'[]'",
  })
  attributesSnapshot: Array<{ name: string; value: string }>;
}
