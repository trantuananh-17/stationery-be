import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../register/register.command';
import { Credential } from '../../../domain/entities/credential.entity';
import { Logger } from '@nestjs/common';
import { UserPort } from '../../ports/grpc/user-grpc.port';
import { ICredentialCommandRepository } from '../../ports/repositories/credential-command.repo';
import { IPasswordService } from '../../ports/services/password.port';
import { IEventPublisher } from '../../ports/producers/event-publisher.port';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userGrpcPort: UserPort,
    private readonly credentialRepo: ICredentialCommandRepository,
    private readonly passwordSerivce: IPasswordService,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: RegisterCommand) {
    const { email, password, firstName, lastName } = command;

    const response = await this.userGrpcPort.createUser({
      email,
      firstName,
      lastName,
      roleName: 'CUSTOMER',
    });

    const userId = response.userId;
    const passwordHash = await this.passwordSerivce.hash(password);

    const credential = Credential.create(userId, email, passwordHash);

    Logger.log(`Creating credential for user ${userId} with email ${email}: ${credential}`);

    await this.credentialRepo.create(credential);

    await this.eventPublisher.emitCustomerSummarySync({
      eventId: 'evt_9f4f0d8f-4f7d-4c2c-a7c6-8f8e8b7d2f31',
      userId,
      email,
      isActive: true,
      isVerified: true,
    });

    return { userId };
  }
}
