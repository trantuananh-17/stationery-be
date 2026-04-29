import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { AuthInfrasModule } from './infrastructure/auth-infras.module';
import { LoginUserUseCase } from './application/login-user.usecase';
import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { RefreshTokenUseCase } from './application/refresh-token.usecase';

@Module({
  imports: [AuthInfrasModule, JwtProvider, GuardsModule],
  controllers: [AuthController],
  providers: [RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase],
  exports: [JwtProvider, GuardsModule],
})
export class AuthModule {}
