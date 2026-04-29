import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { LoginCommand } from '../../application/commands/login/login.command';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { ResendVerificationCommand } from '../../application/commands/resend-verification/resend-verification.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password/reset-password.command';
import { VerifyEmailCommand } from '../../application/commands/verify-email/verify-email.command';
import { EmailPayloadDto } from '../dtos/email.dto';
import { LoginPayloadDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ResetPasswordPayloadDto } from '../dtos/reset-pass.dto';
import { TokenPayloadDto } from '../dtos/token.dto';
import { AuthGrpcExceptionFilter } from '../filters/auth-grpc-exception.filter';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password/forgot-password.command';
import { RefreshTokenPayloadDto } from '../dtos/refresh-token.dto';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(AuthGrpcExceptionFilter)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AuthorizerService', 'registerUser')
  async register(@Payload() body: RegisterDto) {
    const { email, password, firstName, lastName } = body;
    return await this.commandBus.execute(new RegisterCommand(email, password, firstName, lastName));
  }

  @GrpcMethod('AuthorizerService', 'loginUser')
  async login(@Payload() payload: LoginPayloadDto) {
    const { email, password } = payload;
    return await this.commandBus.execute(new LoginCommand(email, password));
  }

  @GrpcMethod('AuthorizerService', 'verifyEmail')
  async verifyEmail(@Payload() payload: TokenPayloadDto) {
    const { token } = payload;
    return await this.commandBus.execute(new VerifyEmailCommand(token));
  }

  @GrpcMethod('AuthorizerService', 'resendEmail')
  async resendEmail(@Payload() payload: EmailPayloadDto) {
    const { email } = payload;
    return await this.commandBus.execute(new ResendVerificationCommand(email));
  }

  @GrpcMethod('AuthorizerService', 'resetPassword')
  async resetPassword(@Payload() payload: ResetPasswordPayloadDto) {
    const { token, password } = payload;
    return await this.commandBus.execute(new ResetPasswordCommand(token, password));
  }

  @GrpcMethod('AuthorizerService', 'forgotPassword')
  async forgotPassword(@Payload() payload: EmailPayloadDto) {
    const { email } = payload;
    return await this.commandBus.execute(new ForgotPasswordCommand(email));
  }

  @GrpcMethod('AuthorizerService', 'refreshToken')
  async refreshToken(@Payload() payload: RefreshTokenPayloadDto) {
    const { refreshToken } = payload;

    return await this.commandBus.execute(new RefreshTokenCommand(refreshToken));
  }
}
