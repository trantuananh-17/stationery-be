import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { UserInfraModule } from './infrastructure/user-infras.module';

@Module({
  imports: [CqrsModule, TypeOrmProvider, UserInfraModule],
  controllers: [UserController],
  providers: [CreateUserHandler],
})
export class UserModule {}
