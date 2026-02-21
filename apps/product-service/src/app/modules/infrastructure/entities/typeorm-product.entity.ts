import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';

@Entity({ name: 'products' })
export class ProductOrmEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  categoryId: string;
}
