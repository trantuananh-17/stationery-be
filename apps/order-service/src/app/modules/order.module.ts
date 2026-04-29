import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderInfraModule } from './infrastructure/order-infras.module';
import { OrderController } from './presentation/controllers/order.controller';
import { CheckoutHandler } from './application/commands/checkout/checkout.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, OrderInfraModule],
  controllers: [OrderController],
  providers: [CheckoutHandler],
  exports: [],
})
export class OrderModule {}
