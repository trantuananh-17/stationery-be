import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { ResendVerificationCommand } from './resend-verification.command';
import { ITokenService } from '../../ports/services/token.port';
import { Logger } from '@nestjs/common';
import {
  CredentialNotFoundError,
  VerificationCooldownError,
} from '../../../domain/errors/credential.error';

@CommandHandler(ResendVerificationCommand)
export class ResendverificationHandler implements ICommandHandler<ResendVerificationCommand> {
  constructor(
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly credentialRepoCommand: ICredentialCommandRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: ResendVerificationCommand): Promise<void> {
    const { email } = command;
    const credential = await this.credentialRepoQuery.findByEmail(email);

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    if (!credential.canResendVerification()) {
      throw new VerificationCooldownError();
    }

    const token = this.tokenService.generateRandomToken();

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    credential.setVerificationToken(token, expires);

    Logger.log(JSON.stringify(credential));

    await this.credentialRepoCommand.save(credential);
  }
}
