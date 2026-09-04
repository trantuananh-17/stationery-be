import { Module } from '@nestjs/common';

import { OrderController } from './presentation/controllers/order.controller';

import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { OrderInfrasModule } from './infrastructure/order-infra.module';
import { CheckoutUseCase } from './application/checkout.usecase';
import { GetOrdersAdminUseCase } from './application/get-orders-admin.usecase';
import { GetOrderUseCase } from './application/get-order.usecase';
import { GetMyOrderUseCase } from './application/get-my-order.usecase';
import { UpdateOrderStatusUseCase } from './application/update-order-status.usecase';
import { GetOrdersByUserIdUseCase } from './application/get-orders-userid.usecase';
import { CouponUseCase, ShippingQuoteUseCase } from './application/coupon.usecase';
import { CouponController } from './presentation/controllers/coupon.controller';

@Module({
  imports: [OrderInfrasModule, JwtProvider, GuardsModule],
  controllers: [OrderController, CouponController],
  providers: [
    CheckoutUseCase,
    GetOrdersAdminUseCase,
    GetOrderUseCase,
    GetMyOrderUseCase,
    UpdateOrderStatusUseCase,
    GetOrdersByUserIdUseCase,
    CouponUseCase,
    ShippingQuoteUseCase,
  ],
  exports: [],
})
export class OrderModule {}
