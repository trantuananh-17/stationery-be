import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Address } from '../../../../domain/entities/address.entity';
import { IAddressCommandRepository } from '../../../ports/repositories/address-command.repo';
import { CreateAddressCommand } from './create-address.command';

@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler implements ICommandHandler<CreateAddressCommand> {
  constructor(private readonly addressRepo: IAddressCommandRepository) {}

  async execute(command: CreateAddressCommand) {
    const { userId, input } = command;

    // Địa chỉ đầu tiên của user luôn là mặc định, dù client không yêu cầu.
    const existing = await this.addressRepo.countByUser(userId);
    const isDefault = input.isDefault || existing === 0;

    const address = Address.create(userId, { ...input, isDefault });

    if (isDefault) {
      await this.addressRepo.clearDefault(userId, address.id);
    }

    await this.addressRepo.save(address);

    return address;
  }
}
