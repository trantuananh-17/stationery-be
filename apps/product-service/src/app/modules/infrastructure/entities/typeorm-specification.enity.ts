import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { ProductOrmEntity } from './typeorm-product.entity';
import { AttributeOrmEntity } from './typeorm-attribute.entity';

@Entity({ name: 'specifications' })
export class SpecificationOrmEntity extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'attribute_id', type: 'uuid' })
  attributeId: string;

  @Column()
  value: string;

  @ManyToOne(() => ProductOrmEntity, (product) => product.specifications)
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @ManyToOne(() => AttributeOrmEntity, (attribute) => attribute.specifications)
  @JoinColumn({ name: 'attribute_id' })
  attribute: AttributeOrmEntity;
}
