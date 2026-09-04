import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderInfraModule } from './infrastructure/order-infras.module';
import { OrderController } from './presentation/controllers/order.controller';
import { CheckoutHandler } from './application/commands/checkout/checkout.handler';
import { CreateCouponHandler } from './application/commands/coupons/create-coupon/create-coupon.handler';
import { UpdateCouponHandler } from './application/commands/coupons/update-coupon/update-coupon.handler';
import { DeleteCouponHandler } from './application/commands/coupons/delete-coupon/delete-coupon.handler';
import { GetCouponsHandler } from './application/queries/get-coupons/get-coupons.handler';
import { ValidateCouponHandler } from './application/queries/validate-coupon/validate-coupon.handler';
import { UpdateStatusHandler } from './application/commands/update-status/update-status.handler';
import { GetOrderPaymentHandler } from './application/queries/get-order-checkout/get-order-payment.handler';
import { GetOrdersByAdminHandler } from './application/queries/get-orders-admin/get-orders-admin.handler';
import { GetOrderHandler } from './application/queries/get-order/get-order.handler';
import { GetMyOrderHandler } from './application/queries/get-my-order/get-my-order.handler';
import { HandlePaymentHandler } from './application/commands/handle-payment/handle-payment.handler';
import { GetMyOrdersHandler } from './application/queries/get-my-orders/get-my-orders.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, OrderInfraModule],
  controllers: [OrderController],
  providers: [
    CheckoutHandler,
    UpdateStatusHandler,
    HandlePaymentHandler,
    GetOrderPaymentHandler,
    GetOrdersByAdminHandler,
    GetOrderHandler,
    GetMyOrderHandler,
    GetMyOrdersHandler,
    CreateCouponHandler,
    UpdateCouponHandler,
    DeleteCouponHandler,
    GetCouponsHandler,
    ValidateCouponHandler,
  ],
  exports: [],
})
export class OrderModule {}
