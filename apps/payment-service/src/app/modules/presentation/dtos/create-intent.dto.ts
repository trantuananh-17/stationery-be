import { IsUUID } from 'class-validator';

export class CreatePaymentRequest {
  @IsUUID()
  orderId: string;

  @IsUUID()
  userId: string;
}
