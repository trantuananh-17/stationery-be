import { BaseEntity } from '@common/databases/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { UserOrmEntity } from './typeorm-user.entity';

@Entity({ name: 'addresses' })
@Index(['userId'])
export class AddressOrmEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address2?: string;

  @Column({ type: 'varchar', length: 100 })
  ward: string;

  @Column({ type: 'varchar', length: 100 })
  district: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;
}
