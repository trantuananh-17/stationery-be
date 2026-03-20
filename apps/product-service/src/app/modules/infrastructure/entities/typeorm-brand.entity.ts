import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';

@Entity({ name: 'brands' })
export class BrandOrmEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
