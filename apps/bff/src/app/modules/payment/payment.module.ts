import { Module } from '@nestjs/common';

import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { PaymentInfrasModule } from './infrastructure/payment-infras.module';
import { CreatePaymentIntentUseCase } from './application/create-payment.usecase';
import { PaymentController } from './presentation/controllers/payment.controller';

@Module({
  imports: [PaymentInfrasModule, JwtProvider, GuardsModule],
  controllers: [PaymentController],
  providers: [CreatePaymentIntentUseCase],
  exports: [],
})
export class PaymentModule {}
