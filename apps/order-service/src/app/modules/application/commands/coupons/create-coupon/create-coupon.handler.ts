import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Coupon } from '../../../../domain/entities/coupon.entity';
import { CouponCodeExistsError } from '../../../../domain/errors/coupon.error';
import { ICouponRepository } from '../../../ports/repositories/coupon.repo';
import { CreateCouponCommand } from './create-coupon.command';

@CommandHandler(CreateCouponCommand)
export class CreateCouponHandler implements ICommandHandler<CreateCouponCommand> {
  constructor(private readonly couponRepo: ICouponRepository) {}

  async execute(command: CreateCouponCommand) {
    const existing = await this.couponRepo.findByCode(command.input.code);

    if (existing) {
      throw new CouponCodeExistsError(command.input.code);
    }

    const coupon = Coupon.create(command.input);

    await this.couponRepo.save(coupon);

    return coupon;
  }
}
