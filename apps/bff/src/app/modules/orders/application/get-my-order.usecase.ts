import { Inject, Injectable } from '@nestjs/common';
import { GetMyOrderGrpcRequest, OrderDetailGrpcResponse } from './ports/dtos/order.dto';
import { OrderPort } from './ports/order.port';

@Injectable()
export class GetMyOrderUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: GetMyOrderGrpcRequest): Promise<OrderDetailGrpcResponse> {
    return this.orderPort.getMyOrder(data);
  }
}
