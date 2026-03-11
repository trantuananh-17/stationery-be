import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfraModule } from './infrastructure/auth-infrs.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterHandler } from './application/commands/register/register.handler';
import { LoginHandler } from './application/commands/login/login.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, AuthInfraModule],
  controllers: [AuthController],
  providers: [RegisterHandler, LoginHandler],
  exports: [],
})
export class AuthModule {}
