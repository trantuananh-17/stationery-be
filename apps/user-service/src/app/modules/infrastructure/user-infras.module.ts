import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserOrmEntity } from './entities/typeorm-user.entity';
import { RoleOrmEntity } from './entities/typeorm-role.entity';
import { PermissionOrmEntity } from './entities/typeorm-permission.entity';

import { IUserCommandRepository } from '../application/ports/repositories/user-command.repo';
import { IRoleQueryRepository } from '../application/ports/repositories/role-query.repo';

import { TypeOrmUserCommandRepository } from './repositories/typeorm-user.command';
import { TypeOrmRoleQueryRepository } from './repositories/typeorm-role.query';
import { IUserQueryRepository } from '../application/ports/repositories/user-query.repo';
import { TypeOrmUserQueryRepository } from './repositories/typeorm-user.query';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity, PermissionOrmEntity])],
  providers: [
    {
      provide: IUserCommandRepository,
      useClass: TypeOrmUserCommandRepository,
    },
    {
      provide: IUserQueryRepository,
      useClass: TypeOrmUserQueryRepository,
    },
    {
      provide: IRoleQueryRepository,
      useClass: TypeOrmRoleQueryRepository,
    },
  ],
  exports: [IUserCommandRepository, IRoleQueryRepository, IUserQueryRepository],
})
export class UserInfraModule {}
