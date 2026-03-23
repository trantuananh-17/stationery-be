import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { JwtProvider } from '@common/configuration/jwt.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IProductGrpcPort } from '../application/ports/grpc/product-grpc.port';
import { ICartCommandRepository } from '../application/ports/repositories/cart-command.repo';
import { ICartQueryRepository } from '../application/ports/repositories/cart-query.repo';
import { IUnitOfWork } from '../application/ports/services/unit-of-work.port';
import { ProductGrpcAdapter } from './grpc/product-grpc.adapter';
import { TypeOrmCartCommandRepository } from './repositories/typeorm-cart-command.repo';
import { TypeOrmCartQueryRepository } from './repositories/typeorm-cart-query.repo';
import { TypeOrmUnitOfWork } from './services/unit-of-work.service';
import { CartOrmEntity } from './entities/typeorm-cart.entity';
import { CartItemOrmEntity } from './entities/typeorm-cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartOrmEntity, CartItemOrmEntity]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE)]),
    JwtProvider,
  ],
  providers: [
    ProductGrpcAdapter,
    {
      provide: IProductGrpcPort,
      useExisting: ProductGrpcAdapter,
    },
    {
      provide: ICartCommandRepository,
      useClass: TypeOrmCartCommandRepository,
    },
    {
      provide: ICartQueryRepository,
      useClass: TypeOrmCartQueryRepository,
    },
    {
      provide: IUnitOfWork,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [IProductGrpcPort, ICartCommandRepository, ICartQueryRepository, IUnitOfWork],
})
export class CartInfraModule {}
