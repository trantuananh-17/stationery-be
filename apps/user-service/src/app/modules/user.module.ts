import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { UserInfraModule } from './infrastructure/user-infras.module';
import { GetUserHandler } from './application/queries/get-user-auth/get-user-auth.handler';
import { UpsertCustomerSummaryHandler } from './application/commands/upsert-sumary/upsert-sumary.handler';
import { UpsertLastOrderHandler } from './application/commands/upsert-last-order/upsert-last-order.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, UserInfraModule],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    GetUserHandler,
    UpsertCustomerSummaryHandler,
    UpsertLastOrderHandler,
  ],
})
export class UserModule {}
