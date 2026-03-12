import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { IPasswordService } from '../../ports/services/password.port';
import { ResetPasswordCommand } from './reset-password.command';
import { ResetTokenNotFoundError } from '../../../domain/errors/credential.error';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly credentialRepoCommand: ICredentialCommandRepository,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { token, password } = command;
    const credential = await this.credentialRepoQuery.findByResetPasswordToken(token);

    if (!credential) {
      throw new ResetTokenNotFoundError();
    }

    const passwordHash = await this.passwordService.hash(password);

    credential.resetPassword(token, passwordHash);

    await this.credentialRepoCommand.save(credential);
  }
}
