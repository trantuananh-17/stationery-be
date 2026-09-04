import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AddressNotFoundError } from '../../../../domain/errors/address-not-found.error';
import { IAddressCommandRepository } from '../../../ports/repositories/address-command.repo';
import { IAddressQueryRepository } from '../../../ports/repositories/address-query.repo';
import { DeleteAddressCommand } from './delete-address.command';

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler implements ICommandHandler<DeleteAddressCommand> {
  constructor(
    private readonly addressRepo: IAddressCommandRepository,
    private readonly addressQueryRepo: IAddressQueryRepository,
  ) {}

  async execute(command: DeleteAddressCommand) {
    const { userId, addressId } = command;

    const address = await this.addressQueryRepo.findOne(userId, addressId);

    if (!address) {
      throw new AddressNotFoundError();
    }

    await this.addressRepo.delete(userId, addressId);

    // Xoá địa chỉ mặc định thì đôn địa chỉ còn lại mới nhất lên làm mặc định,
    // nếu không user sẽ còn sổ địa chỉ mà không có cái nào được chọn sẵn.
    if (address.isDefault) {
      const remaining = await this.addressQueryRepo.findByUser(userId);
      const next = remaining[0];

      if (next) {
        next.markAsDefault();
        await this.addressRepo.save(next);
      }
    }

    return { addressId };
  }
}
