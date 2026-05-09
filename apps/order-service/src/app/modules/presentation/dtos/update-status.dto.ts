import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export class OrderUpdateStatusEventDto {
  @IsUUID()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
