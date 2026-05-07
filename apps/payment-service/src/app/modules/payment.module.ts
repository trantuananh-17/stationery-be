import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PaymentController } from './presentation/controllers/payment.controller';
import { PaymentInfrasModule } from './infrastructure/payment-infras.module';

@Module({
  imports: [PaymentInfrasModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
