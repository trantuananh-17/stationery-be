import { CheckoutGrpcRequest, CheckoutGrpcResponse } from './dtos/order.dto';

export abstract class OrderPort {
  abstract checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse>;
}
