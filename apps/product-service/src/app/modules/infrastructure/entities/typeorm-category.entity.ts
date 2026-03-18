import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';

@Entity({ name: 'categories' })
export class CategoryOrmEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToOne(() => CategoryOrmEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryOrmEntity | null;

  @OneToMany(() => CategoryOrmEntity, (category) => category.parent)
  children: CategoryOrmEntity[];

  @Column({ type: 'integer', default: 0 })
  position: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
