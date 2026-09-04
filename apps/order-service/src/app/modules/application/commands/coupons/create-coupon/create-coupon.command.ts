import { ICommand } from '@nestjs/cqrs';

import { CouponInput } from '../../../../domain/entities/coupon.entity';

export class CreateCouponCommand implements ICommand {
  constructor(public readonly input: CouponInput) {}
}
