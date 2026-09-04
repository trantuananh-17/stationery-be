import { ICommand } from '@nestjs/cqrs';

import { AddressInput } from '../../../../domain/entities/address.entity';

export class UpdateAddressCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
    public readonly input: AddressInput,
  ) {}
}
