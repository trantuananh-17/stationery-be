import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { AttributeOrmEntity } from './typeorm-attribute.entity';

@Entity({ name: 'attribute_values' })
export class AttributeValueOrmEntity extends BaseEntity {
  @Column({ name: 'attribute_id', type: 'uuid' })
  attributeId: string;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @ManyToOne(() => AttributeOrmEntity, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: AttributeOrmEntity;
}
