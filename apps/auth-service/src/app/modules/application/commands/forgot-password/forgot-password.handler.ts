import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICredentialQueryRepository } from '../../ports/repositories/credential-query.repo';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { ForgotPasswordCommand } from './forgot-password.command';
import { ITokenService } from '../../ports/services/token.port';
import { CredentialNotFoundError } from '../../../domain/errors/credential.error';
import { IMailSender } from '../../ports/services/mail.port';

const RESET_TOKEN_TTL_MINUTES = 15;

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    private readonly credentialRepoQuery: ICredentialQueryRepository,
    private readonly credentialRepoCommand: ICredentialCommandRepository,
    private readonly tokenService: ITokenService,
    private readonly mailSender: IMailSender,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const { email } = command;

    const credential = await this.credentialRepoQuery.findByEmail(email);

    if (!credential) {
      throw new CredentialNotFoundError();
    }

    const token = this.tokenService.generateRandomToken();

    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    credential.setResetPasswordToken(token, expires);

    await this.credentialRepoCommand.save(credential);

    const baseUrl = process.env.FE_BASE_URL ?? 'http://localhost:3000';

    await this.mailSender.sendPasswordReset({
      email,
      resetUrl: `${baseUrl}/vi/auth/reset-password?token=${token}`,
      expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
    });
  }
}
