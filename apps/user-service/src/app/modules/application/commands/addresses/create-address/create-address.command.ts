import { ICommand } from '@nestjs/cqrs';

import { AddressInput } from '../../../../domain/entities/address.entity';

export class CreateAddressCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly input: AddressInput,
  ) {}
}
