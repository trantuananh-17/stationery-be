import { IsUUID } from 'class-validator';

export class getPaymentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  orderId: string;
}
