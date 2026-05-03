import { Order } from '../../../domain/entities/order.entity';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

export abstract class IOrderCommandRepository {
  abstract save(order: Order): Promise<void>;
  abstract updatePaymentStatus(params: {
    orderId: string;
    paymentStatus: PaymentStatus;
    paymentTransactionId?: string;
    orderStatus: OrderStatus;
    paymentProvider?: string;
  }): Promise<void>;
}
