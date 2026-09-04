import { Inject, Injectable } from '@nestjs/common';
import { OrderPort } from './ports/order.port';
import { CheckoutGrpcRequest, CheckoutGrpcResponse } from './ports/dtos/order.dto';

@Injectable()
export class CheckoutUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse> {
    return this.orderPort.checkout(data);
  }
}
