import { ICommand } from '@nestjs/cqrs';
import { RoleName } from '../../domain/enums/role.enum';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roleName: RoleName,
  ) {}
}
