import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { CartGrpcAdapter } from './grpc/cart-grpc.adapter';
import { CartPort } from '../applications/ports/cart.port';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.CART_SERVICE)])],
  providers: [
    CartGrpcAdapter,
    {
      provide: CartPort,
      useExisting: CartGrpcAdapter,
    },
  ],
  exports: [CartPort],
})
export class CartInfrasModule {}
