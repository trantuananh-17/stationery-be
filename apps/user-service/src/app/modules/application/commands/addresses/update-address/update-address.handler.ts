import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AddressNotFoundError } from '../../../../domain/errors/address-not-found.error';
import { IAddressCommandRepository } from '../../../ports/repositories/address-command.repo';
import { IAddressQueryRepository } from '../../../ports/repositories/address-query.repo';
import { UpdateAddressCommand } from './update-address.command';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(
    private readonly addressRepo: IAddressCommandRepository,
    private readonly addressQueryRepo: IAddressQueryRepository,
  ) {}

  async execute(command: UpdateAddressCommand) {
    const { userId, addressId, input } = command;

    const address = await this.addressQueryRepo.findOne(userId, addressId);

    if (!address) {
      throw new AddressNotFoundError();
    }

    address.update(input);

    if (address.isDefault) {
      await this.addressRepo.clearDefault(userId, address.id);
    }

    await this.addressRepo.save(address);

    return address;
  }
}
