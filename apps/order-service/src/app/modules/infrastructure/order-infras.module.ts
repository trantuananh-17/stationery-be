import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ClientsModule.registerAsync([
      GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE),
      GrpcProvider(GRPC_SERVICES.CART_SERVICE),
    ]),
  ],
  providers: [],
  exports: [],
})
export class OrderInfraModule {}
