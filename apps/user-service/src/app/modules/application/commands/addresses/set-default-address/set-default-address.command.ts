import { ICommand } from '@nestjs/cqrs';

export class SetDefaultAddressCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
  ) {}
}
