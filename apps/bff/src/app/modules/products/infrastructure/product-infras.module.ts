import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';

import { ProductGrpcAdapter } from './grpc/product-grpc.adapter';
import { ProductPort } from '../application/ports/product.port';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE)])],
  providers: [
    ProductGrpcAdapter,
    {
      provide: ProductPort,
      useExisting: ProductGrpcAdapter,
    },
  ],
  exports: [ProductPort],
})
export class ProductInfrasModule {}
