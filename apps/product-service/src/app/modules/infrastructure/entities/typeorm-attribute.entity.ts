import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { SpecificationOrmEntity } from './typeorm-specification.enity';
import { AttributeValueOrmEntity } from './typeorm-attribute-value.entity';

@Entity({ name: 'attributes' })
export class AttributeOrmEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  type: 'variant' | 'spec';

  @OneToMany(() => SpecificationOrmEntity, (spec) => spec.attribute)
  specifications: SpecificationOrmEntity[];

  @OneToMany(() => AttributeValueOrmEntity, (value) => value.attribute)
  values: AttributeValueOrmEntity[];
}
