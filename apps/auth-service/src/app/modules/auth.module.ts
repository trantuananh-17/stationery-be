import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ForgotPasswordHandler } from './application/commands/forgot-password/forgot-password.handler';
import { LoginHandler } from './application/commands/login/login.handler';
import { RegisterHandler } from './application/commands/register/register.handler';
import { ResendverificationHandler } from './application/commands/resend-verification/resend-verification.handler';
import { ResetPasswordHandler } from './application/commands/reset-password/reset-password.handler';
import { VerifyEmailHandler } from './application/commands/verify-email/verify-email.handler';
import { AuthInfraModule } from './infrastructure/auth-infrs.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { RefreshTokenHandler } from './application/commands/refresh-token/refresh-token.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, AuthInfraModule],
  controllers: [AuthController],
  providers: [
    RegisterHandler,
    LoginHandler,
    VerifyEmailHandler,
    ResendverificationHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    RefreshTokenHandler,
  ],
  exports: [],
})
export class AuthModule {}
