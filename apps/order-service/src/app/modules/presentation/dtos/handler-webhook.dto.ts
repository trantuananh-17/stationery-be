import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export class HandleWebhookEventDto {
  @IsString()
  eventId: string;

  @IsUUID()
  orderId: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  paymentTransactionId?: string;

  @IsOptional()
  @IsString()
  paymentProvider?: string;
}
