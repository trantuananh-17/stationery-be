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
import { AddressOrmEntity } from './entities/typeorm-address.entity';
import { IAddressCommandRepository } from '../application/ports/repositories/address-command.repo';
import { IAddressQueryRepository } from '../application/ports/repositories/address-query.repo';
import { TypeOrmAddressCommandRepository } from './repositories/typeorm-address.command';
import { TypeOrmAddressQueryRepository } from './repositories/typeorm-address.query';
import { WishlistItemOrmEntity } from './entities/typeorm-wishlist-item.entity';
import { IWishlistRepository } from '../application/ports/repositories/wishlist.repo';
import { TypeOrmWishlistRepository } from './repositories/typeorm-wishlist.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
      CustomerSummaryOrmEntity,
      LastOrderOrmEntity,
      AddressOrmEntity,
      WishlistItemOrmEntity,
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
    {
      provide: IAddressCommandRepository,
      useClass: TypeOrmAddressCommandRepository,
    },
    {
      provide: IAddressQueryRepository,
      useClass: TypeOrmAddressQueryRepository,
    },
    {
      provide: IWishlistRepository,
      useClass: TypeOrmWishlistRepository,
    },
  ],
  exports: [
    IUserCommandRepository,
    IRoleQueryRepository,
    IUserQueryRepository,
    ICustomerSummaryCommandRepository,
    ILastOrderCommandRepository,
    IAddressCommandRepository,
    IAddressQueryRepository,
    IWishlistRepository,
  ],
})
export class UserInfraModule {}
