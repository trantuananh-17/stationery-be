import { IsUUID } from 'class-validator';

export class getMyOrderDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  userId: string;
}
