import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { AuthInfrasModule } from './infrastructure/auth-infras.module';
import { LoginUserUseCase } from './application/login-user.usecase';

@Module({
  imports: [CqrsModule, AuthInfrasModule],
  controllers: [AuthController],
  providers: [RegisterUserUseCase, LoginUserUseCase],
  exports: [],
})
export class AuthModule {}
