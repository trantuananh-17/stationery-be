import { IsUUID } from 'class-validator';

export class getOrderDto {
  @IsUUID()
  orderId: string;
}
