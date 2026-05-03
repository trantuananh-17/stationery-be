import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderInfraModule } from './infrastructure/order-infras.module';
import { OrderController } from './presentation/controllers/order.controller';
import { CheckoutHandler } from './application/commands/checkout/checkout.handler';
import { UpdateStatusHandler } from './application/commands/update-status/update-status.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, OrderInfraModule],
  controllers: [OrderController],
  providers: [CheckoutHandler, UpdateStatusHandler],
  exports: [],
})
export class OrderModule {}
