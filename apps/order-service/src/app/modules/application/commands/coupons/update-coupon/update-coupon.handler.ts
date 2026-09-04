import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CouponCodeExistsError, CouponNotFoundError } from '../../../../domain/errors/coupon.error';
import { ICouponRepository } from '../../../ports/repositories/coupon.repo';
import { UpdateCouponCommand } from './update-coupon.command';

@CommandHandler(UpdateCouponCommand)
export class UpdateCouponHandler implements ICommandHandler<UpdateCouponCommand> {
  constructor(private readonly couponRepo: ICouponRepository) {}

  async execute(command: UpdateCouponCommand) {
    const { couponId, input } = command;

    const coupon = await this.couponRepo.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundError(couponId);
    }

    const duplicated = await this.couponRepo.findByCode(input.code);

    if (duplicated && duplicated.id !== couponId) {
      throw new CouponCodeExistsError(input.code);
    }

    coupon.update(input);

    await this.couponRepo.save(coupon);

    return coupon;
  }
}
