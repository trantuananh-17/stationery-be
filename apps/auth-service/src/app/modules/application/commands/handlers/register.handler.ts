import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../register.command';
import { Credential } from '../../../domain/entities/credential.entity';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor() {} // private readonly userGrpcPort: UserPort, // private readonly repo: ICredentialCommandRepository,

  async execute(command: RegisterCommand) {
    const { email, password, firstName, lastName } = command;

    // const response = await this.userGrpcPort.createUser({
    //   email,
    //   firstName,
    //   lastName,
    // });

    const userId = 'response.id';

    // throw new RpcException({
    //   code: status.INVALID_ARGUMENT,
    //   message: 'Email already exists',
    // });

    const credential = Credential.create(userId, email, password);

    Logger.log(`Creating credential for user ${userId} with email ${email}: ${credential}`);

    // await this.repo.create(credential);

    return { userId };
  }
}
