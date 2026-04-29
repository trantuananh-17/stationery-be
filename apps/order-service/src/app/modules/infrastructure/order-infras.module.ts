import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IProductGrpcPort } from '../application/ports/grpc/product-grpc.port';
import { IOrderCommandRepository } from '../application/ports/repositories/order-command.repo';
import { TypeOrmOrderCommandRepository } from './repositories/typeorm-order-command.repo';
import { IUnitOfWork } from '../application/ports/services/unit-of-work.port';
import { TypeOrmUnitOfWork } from './services/unit-of-work.service';
import { ProductGrpcAdapter } from './grpc/product-grpc.adapter';
import { ICartGrpcPort } from '../application/ports/grpc/cart-grpc.port';
import { CartGrpcAdapter } from './grpc/cart-grpc.adapter';
import { OrderOrmEntity } from './entities/typeorm-order.entity';
import { OrderItemOrmEntity } from './entities/typeorm-order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
    ClientsModule.registerAsync([
      GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE),
      GrpcProvider(GRPC_SERVICES.CART_SERVICE),
    ]),
  ],
  providers: [
    ProductGrpcAdapter,
    CartGrpcAdapter,
    {
      provide: IProductGrpcPort,
      useExisting: ProductGrpcAdapter,
    },
    {
      provide: ICartGrpcPort,
      useExisting: CartGrpcAdapter,
    },
    {
      provide: IOrderCommandRepository,
      useClass: TypeOrmOrderCommandRepository,
    },

    {
      provide: IUnitOfWork,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [IProductGrpcPort, ICartGrpcPort, IOrderCommandRepository, IUnitOfWork],
})
export class OrderInfraModule {}
