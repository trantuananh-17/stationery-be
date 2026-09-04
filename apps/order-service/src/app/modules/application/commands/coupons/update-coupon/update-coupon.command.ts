import { ICommand } from '@nestjs/cqrs';

import { CouponInput } from '../../../../domain/entities/coupon.entity';

export class UpdateCouponCommand implements ICommand {
  constructor(
    public readonly couponId: string,
    public readonly input: CouponInput,
  ) {}
}
