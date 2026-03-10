import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/entities/typeorm-user.entity';
import { IUserCommandRepository } from './application/ports/user-command.repo';
import { TypeOrmUserCommandRepository } from './infrastructure/repositories/typeorm-user.command';
import { IRoleQueryRepository } from './application/ports/role-query.repo';
import { TypeOrmRoleQueryRepository } from './infrastructure/repositories/typeorm-role.query';
import { RoleOrmEntity } from './infrastructure/entities/typeorm-role.entity';
import { PermissionOrmEntity } from './infrastructure/entities/typeorm-permission.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmProvider,
    TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity, PermissionOrmEntity]),
  ],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    { provide: IUserCommandRepository, useClass: TypeOrmUserCommandRepository },
    { provide: IRoleQueryRepository, useClass: TypeOrmRoleQueryRepository },
  ],
  exports: [],
})
export class UserModule {}
