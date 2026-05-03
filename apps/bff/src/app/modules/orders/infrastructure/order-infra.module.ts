import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';

import { OrderGrpcAdapter } from './grpc/order-grpc.adapter';
import { OrderPort } from '../applications/ports/order.port';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.ORDER_SERVICE)])],
  providers: [
    OrderGrpcAdapter,
    {
      provide: OrderPort,
      useExisting: OrderGrpcAdapter,
    },
  ],
  exports: [OrderPort],
})
export class OrderInfrasModule {}
