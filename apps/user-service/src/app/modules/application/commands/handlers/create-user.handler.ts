import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Logger } from '@nestjs/common';
import { IUserCommandRepository } from '../../ports/user-command.repo';
import { EmailAlreadyExistsError } from '../../../domain/errors/email-already-exists.error';
import { IRoleQueryRepository } from '../../ports/role-query.repo';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepo: IUserCommandRepository,
    private readonly roleRepo: IRoleQueryRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const { email, firstName, lastName, roleName } = command;

    const emailVo = Email.create(email);

    const emailExists = await this.userRepo.existsByEmail(emailVo);

    if (emailExists) {
      throw new EmailAlreadyExistsError();
    }

    const role = await this.roleRepo.getByName(roleName);
    if (!role) {
      throw new EmailAlreadyExistsError();
    }

    const user = User.create(emailVo, firstName, lastName, role.id);

    Logger.log(JSON.stringify(user), 'CreateUserHandler');

    await this.userRepo.create(user);

    return { userId: user.id };
  }
}
