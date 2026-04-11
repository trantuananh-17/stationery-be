import { ICommand } from '@nestjs/cqrs';
import { OrderAddress } from '../../../domain/entities/order.entity';

export class CheckoutCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly shippingAddress: OrderAddress,
    public readonly billingAddress: OrderAddress,
    public readonly paymentMethod: string,
    public readonly notes?: string,
    public readonly couponCode?: string,
  ) {}
}
