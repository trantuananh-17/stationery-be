import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { ForgotPasswordCommand } from './forgot-password.command';
import { ITokenService } from '../../ports/services/token.port';
import { Logger } from '@nestjs/common';
import { CredentialNotFoundError } from '../../../domain/errors/credential.error';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly credentialRepoCommand: ICredentialCommandRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const { email } = command;

    const credential = await this.credentialRepoQuery.findByEmail(email);

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    const token = this.tokenService.generateRandomToken();

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    credential.setResetPasswordToken(token, expires);

    Logger.log(JSON.stringify(credential));

    await this.credentialRepoCommand.save(credential);
  }
}
