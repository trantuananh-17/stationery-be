import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPort } from '../../ports/grpc/user-grpc.port';
import { IPasswordService } from '../../ports/services/password.port';
import { LoginCommand } from './login.command';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { ITokenService } from '../../ports/services/token.port';
import { InvalidCredentialError } from '../../../domain/errors/invalid-credential.error';
import { EmailNotVerifiedError } from '../../../domain/errors/email-not-verified.error';
import { AccountLockedError } from '../../../domain/errors/account-locked.error';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userGrpcPort: UserPort,
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly passwordSerivce: IPasswordService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command;

    const credential = await this.credentialRepoQuery.findByEmail(email);

    if (!credential) {
      throw new InvalidCredentialError();
    }

    const isPasswordValid = await this.passwordSerivce.compare(password, credential.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialError();
    }

    if (!credential.isEmailVerified) {
      throw new EmailNotVerifiedError();
    }

    if (!credential.isActive) {
      throw new AccountLockedError();
    }

    const user = await this.userGrpcPort.getUserAuth({ userId: credential.userId });

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({
        userId: credential.userId,
        email: credential.email,
        role: user.role,
        permissions: user.permissions,
      }),
      this.tokenService.generateRefreshToken({
        userId: credential.userId,
        email: credential.email,
        role: user.role,
        permissions: user.permissions,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
