import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { RoleName } from '../../domain/enums/role.enum';
import { UserOrmEntity } from './typeorm-user.entity';
import { PermissionOrmEntity } from './typeorm-permission.entity';

@Entity({ name: 'roles' })
export class RoleOrmEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RoleName,
    unique: true,
  })
  name: RoleName;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @ManyToMany(() => PermissionOrmEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionOrmEntity[];

  @OneToMany(() => UserOrmEntity, (user) => user.role)
  users: UserOrmEntity[];
}
