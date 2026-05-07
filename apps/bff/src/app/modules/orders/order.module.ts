import { Module } from '@nestjs/common';

import { OrderController } from './presentation/controllers/order.controller';

import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { OrderInfrasModule } from './infrastructure/order-infra.module';
import { CheckoutUseCase } from './applications/checkout.usecase';
import { GetOrdersAdminUseCase } from './applications/get-orders-admin.usecase';
import { GetOrderUseCase } from './applications/get-order.usecase';
import { GetMyOrderUseCase } from './applications/get-my-order.usecase';

@Module({
  imports: [OrderInfrasModule, JwtProvider, GuardsModule],
  controllers: [OrderController],
  providers: [CheckoutUseCase, GetOrdersAdminUseCase, GetOrderUseCase, GetMyOrderUseCase],
  exports: [],
})
export class OrderModule {}
