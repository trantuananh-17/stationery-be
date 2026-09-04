import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../application/ports/dtos/order.dto';

export class OrderUpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
