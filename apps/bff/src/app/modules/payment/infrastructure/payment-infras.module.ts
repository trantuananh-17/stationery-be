import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';

import { PaymentGrpcAdapter } from './grpc/payment-grpc.adapter';
import { PaymentPort } from '../application/ports/payment.port';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.PAYMENT_SERVICE)])],
  providers: [
    PaymentGrpcAdapter,
    {
      provide: PaymentPort,
      useExisting: PaymentGrpcAdapter,
    },
  ],
  exports: [PaymentPort],
})
export class PaymentInfrasModule {}
