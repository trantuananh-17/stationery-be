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
import { CustomerSummaryOrmEntity } from './entities/typeorm-customer-summary.entity';
import { LastOrderOrmEntity } from './entities/typeorm-last-order.entity';
import { ICustomerSummaryCommandRepository } from '../application/ports/repositories/customer-summary-command.repo';
import { TypeormCustomerSummaryRepository } from './repositories/typeorm-customer-summary.command';
import { ILastOrderCommandRepository } from '../application/ports/repositories/last-order-command.repo';
import { TypeormLastOrderRepository } from './repositories/typeorm-lastorder.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
      CustomerSummaryOrmEntity,
      LastOrderOrmEntity,
    ]),
  ],
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
    {
      provide: ICustomerSummaryCommandRepository,
      useClass: TypeormCustomerSummaryRepository,
    },
    {
      provide: ILastOrderCommandRepository,
      useClass: TypeormLastOrderRepository,
    },
  ],
  exports: [
    IUserCommandRepository,
    IRoleQueryRepository,
    IUserQueryRepository,
    ICustomerSummaryCommandRepository,
    ILastOrderCommandRepository,
  ],
})
export class UserInfraModule {}
