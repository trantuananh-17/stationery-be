import { ICommand } from '@nestjs/cqrs';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class UpdateStatusCommand implements ICommand {
  constructor(
    public readonly eventId: string,
    public readonly orderId: string,
    public readonly orderStatus: OrderStatus,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentTransactionId?: string,
    public readonly paymentProvider?: string,
  ) {}
}
