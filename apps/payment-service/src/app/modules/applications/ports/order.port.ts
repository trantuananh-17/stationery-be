import { OrderPaymentGrpcRequest, OrderPaymentResponse } from './dtos/order.dto';

export abstract class OrderPort {
  abstract getOrderPayment(data: OrderPaymentGrpcRequest): Promise<OrderPaymentResponse>;
}
