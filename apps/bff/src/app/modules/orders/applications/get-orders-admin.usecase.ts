import { Inject, Injectable } from '@nestjs/common';
import { GetOrdersAdminGrpcRequest, OrdersAdminGrpcResponse } from './ports/dtos/order.dto';
import { OrderPort } from './ports/order.port';

@Injectable()
export class GetOrdersAdminUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse> {
    return this.orderPort.getOrdersAdmin(data);
  }
}
