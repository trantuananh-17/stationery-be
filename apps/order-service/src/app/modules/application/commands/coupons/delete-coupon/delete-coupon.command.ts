import { ICommand } from '@nestjs/cqrs';

export class DeleteCouponCommand implements ICommand {
  constructor(public readonly couponId: string) {}
}
