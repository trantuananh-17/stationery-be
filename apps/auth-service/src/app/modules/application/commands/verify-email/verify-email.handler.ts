import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { VerificationTokenNotFoundError } from '../../../domain/errors/credential.error';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly credentialRepoCommand: ICredentialCommandRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const { token } = command;
    const credential = await this.credentialRepoQuery.findByVerificationToken(token);

    if (!credential) {
      throw new VerificationTokenNotFoundError();
    }

    credential.verifyEmail(token);

    await this.credentialRepoCommand.save(credential);
  }
}
