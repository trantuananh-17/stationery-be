import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { VariantOrmEntity } from './typeorm-variant.entity';

@Entity({ name: 'variant_attributes' })
export class VariantAttributeOrmEntity extends BaseEntity {
  @Column({ name: 'variant_id', type: 'uuid' })
  variantId: string;

  @Column({ name: 'attribute_value_id', type: 'uuid' })
  attributeValueId: string;

  @ManyToOne(() => VariantOrmEntity, (variant) => variant.attributes)
  @JoinColumn({ name: 'variant_id' })
  variant: VariantOrmEntity;
}
