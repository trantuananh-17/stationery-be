import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { UserInfraModule } from './infrastructure/user-infras.module';
import { GetUserAuthHandler } from './application/queries/get-user-auth/get-user-auth.handler';
import { UpsertCustomerSummaryHandler } from './application/commands/upsert-sumary/upsert-sumary.handler';
import { UpsertLastOrderHandler } from './application/commands/upsert-last-order/upsert-last-order.handler';
import { GetUserHandler } from './application/queries/get-user/get-user.handler';
import { GetUsersHandler } from './application/queries/get-users/get-users.handler';
import { CreateAddressHandler } from './application/commands/addresses/create-address/create-address.handler';
import { UpdateAddressHandler } from './application/commands/addresses/update-address/update-address.handler';
import { DeleteAddressHandler } from './application/commands/addresses/delete-address/delete-address.handler';
import { SetDefaultAddressHandler } from './application/commands/addresses/set-default-address/set-default-address.handler';
import { GetAddressesHandler } from './application/queries/get-addresses/get-addresses.handler';
import { AddWishlistItemHandler } from './application/commands/wishlist/add-wishlist-item/add-wishlist-item.handler';
import { RemoveWishlistItemHandler } from './application/commands/wishlist/remove-wishlist-item/remove-wishlist-item.handler';
import { GetWishlistHandler } from './application/queries/get-wishlist/get-wishlist.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, UserInfraModule],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    GetUserAuthHandler,
    UpsertCustomerSummaryHandler,
    UpsertLastOrderHandler,
    GetUserHandler,
    GetUsersHandler,
    CreateAddressHandler,
    UpdateAddressHandler,
    DeleteAddressHandler,
    SetDefaultAddressHandler,
    GetAddressesHandler,
    AddWishlistItemHandler,
    RemoveWishlistItemHandler,
    GetWishlistHandler,
  ],
})
export class UserModule {}
