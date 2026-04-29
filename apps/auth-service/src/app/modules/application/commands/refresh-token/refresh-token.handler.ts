import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { ITokenService, TokenPayloadDto } from '../../ports/services/token.port';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import {
  AccountLockedError,
  EmailNotVerifiedError,
  InvalidCredentialError,
} from '../../../domain/errors/credential.error';
import { UserPort } from '../../ports/grpc/user-grpc.port';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly credentialRepo: ICredentialQueryRepository,
    private readonly userGrpcPort: UserPort,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken: token } = command;

    if (!token) {
      throw new UnauthorizedException('Refresh token là bắt buộc');
    }

    let decoded: TokenPayloadDto;

    try {
      decoded = await this.tokenService.verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const credential = await this.credentialRepo.findByUserId(decoded.userId);

    console.log(credential);

    if (!credential) {
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
