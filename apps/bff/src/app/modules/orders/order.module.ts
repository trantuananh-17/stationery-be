import { Module } from '@nestjs/common';

import { OrderController } from './presentation/controllers/order.controller';

import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { OrderInfrasModule } from './infrastructure/order-infra.module';
import { CheckoutUseCase } from './applications/checkout.usecase';
import { GetOrdersAdminUseCase } from './applications/get-orders-admin.usecase';

@Module({
  imports: [OrderInfrasModule, JwtProvider, GuardsModule],
  controllers: [OrderController],
  providers: [CheckoutUseCase, GetOrdersAdminUseCase],
  exports: [],
})
export class OrderModule {}
