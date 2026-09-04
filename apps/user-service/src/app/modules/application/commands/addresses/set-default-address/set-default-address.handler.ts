import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AddressNotFoundError } from '../../../../domain/errors/address-not-found.error';
import { IAddressCommandRepository } from '../../../ports/repositories/address-command.repo';
import { IAddressQueryRepository } from '../../../ports/repositories/address-query.repo';
import { SetDefaultAddressCommand } from './set-default-address.command';

@CommandHandler(SetDefaultAddressCommand)
export class SetDefaultAddressHandler implements ICommandHandler<SetDefaultAddressCommand> {
  constructor(
    private readonly addressRepo: IAddressCommandRepository,
    private readonly addressQueryRepo: IAddressQueryRepository,
  ) {}

  async execute(command: SetDefaultAddressCommand) {
    const { userId, addressId } = command;

    const address = await this.addressQueryRepo.findOne(userId, addressId);

    if (!address) {
      throw new AddressNotFoundError();
    }

    await this.addressRepo.clearDefault(userId, addressId);

    address.markAsDefault();
    await this.addressRepo.save(address);

    return address;
  }
}
