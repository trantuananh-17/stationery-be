import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PaymentController } from './controllers/payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
