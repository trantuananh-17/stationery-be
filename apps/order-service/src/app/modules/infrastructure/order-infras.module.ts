import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICartGrpcPort } from '../application/ports/grpc/cart-grpc.port';
import { IProductGrpcPort } from '../application/ports/grpc/product-grpc.port';
import { IOrderCommandRepository } from '../application/ports/repositories/order-command.repo';
import { IOrderQueryRepository } from '../application/ports/repositories/order-query.repo';
import { IUnitOfWork } from '../application/ports/services/unit-of-work.port';
import { OrderItemOrmEntity } from './entities/typeorm-order-item.entity';
import { OrderOrmEntity } from './entities/typeorm-order.entity';
import { CartGrpcAdapter } from './grpc/cart-grpc.adapter';
import { ProductGrpcAdapter } from './grpc/product-grpc.adapter';
import { TypeOrmOrderCommandRepository } from './repositories/typeorm-order-command.repo';
import { TypeOrmOrderQueryRepository } from './repositories/typeorm-order-query.repo';
import { TypeOrmUnitOfWork } from './services/unit-of-work.service';
import { IEventPublisher } from '../application/ports/producers/event-publisher.port';
import { EventPublisherKafka } from './kafka/event-publisher.kafka';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enums/queue.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
    ClientsModule.registerAsync([
      GrpcProvider(GRPC_SERVICES.PRODUCT_SERVICE),
      GrpcProvider(GRPC_SERVICES.CART_SERVICE),
    ]),
    KafkaModule.register(QUEUE_SERVICES.ORDER),
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
      provide: IOrderQueryRepository,
      useClass: TypeOrmOrderQueryRepository,
    },

    {
      provide: IUnitOfWork,
      useClass: TypeOrmUnitOfWork,
    },
    {
      provide: IEventPublisher,
      useClass: EventPublisherKafka,
    },
  ],
  exports: [
    IProductGrpcPort,
    ICartGrpcPort,
    IOrderCommandRepository,
    IOrderQueryRepository,
    IUnitOfWork,
    IEventPublisher,
  ],
})
export class OrderInfraModule {}
