import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { RoleOrmEntity } from './typeorm-role.entity';

@Entity({ name: 'permissions' })
export class PermissionOrmEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @ManyToMany(() => RoleOrmEntity, (role) => role.permissions)
  roles: RoleOrmEntity[];
}
