import { ICommand } from '@nestjs/cqrs';

export class DeleteAddressCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
  ) {}
}
