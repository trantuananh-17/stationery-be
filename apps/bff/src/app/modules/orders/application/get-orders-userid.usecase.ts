import { Inject, Injectable } from '@nestjs/common';
import { GetOrdersByUserIdGrpcRequest, OrdersByUserIdGrpcResponse } from './ports/dtos/order.dto';
import { OrderPort } from './ports/order.port';

@Injectable()
export class GetOrdersByUserIdUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: GetOrdersByUserIdGrpcRequest): Promise<OrdersByUserIdGrpcResponse> {
    return this.orderPort.getOrdersByUserId(data);
  }
}
