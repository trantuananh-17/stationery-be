import { Inject, Injectable } from '@nestjs/common';
import { UpdateOrderStatusRequest } from './ports/dtos/order.dto';
import { OrderPort } from './ports/order.port';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(OrderPort)
    private readonly orderPort: OrderPort,
  ) {}

  execute(data: UpdateOrderStatusRequest): Promise<void> {
    return this.orderPort.updateOrderStatus(data);
  }
}
