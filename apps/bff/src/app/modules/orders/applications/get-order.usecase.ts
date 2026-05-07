import { Inject, Injectable } from '@nestjs/common';
import { OrderPort } from './ports/order.port';
import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetOrderGrpcRequest,
  OrderDetailGrpcResponse,
} from './ports/dtos/order.dto';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: GetOrderGrpcRequest): Promise<OrderDetailGrpcResponse> {
    return this.orderPort.getOrder(data);
  }
}
