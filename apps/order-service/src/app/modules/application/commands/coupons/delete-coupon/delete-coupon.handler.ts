import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CouponNotFoundError } from '../../../../domain/errors/coupon.error';
import { ICouponRepository } from '../../../ports/repositories/coupon.repo';
import { DeleteCouponCommand } from './delete-coupon.command';

@CommandHandler(DeleteCouponCommand)
export class DeleteCouponHandler implements ICommandHandler<DeleteCouponCommand> {
  constructor(private readonly couponRepo: ICouponRepository) {}

  async execute(command: DeleteCouponCommand) {
    const deleted = await this.couponRepo.delete(command.couponId);

    if (!deleted) {
      throw new CouponNotFoundError(command.couponId);
    }

    return { couponId: command.couponId };
  }
}
