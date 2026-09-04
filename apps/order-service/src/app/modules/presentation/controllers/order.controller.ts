import { Body, Controller, Post, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { CheckoutCommand } from '../../application/commands/checkout/checkout.command';
import {
  SHIPPING_FREE_THRESHOLD,
  calculateShippingFee,
} from '../../domain/services/shipping-policy';
import { Coupon, CouponInput } from '../../domain/entities/coupon.entity';
import { CouponType } from '../../domain/enums/coupon-type.enum';
import { CreateCouponCommand } from '../../application/commands/coupons/create-coupon/create-coupon.command';
import { UpdateCouponCommand } from '../../application/commands/coupons/update-coupon/update-coupon.command';
import { DeleteCouponCommand } from '../../application/commands/coupons/delete-coupon/delete-coupon.command';
import {
  GetCouponsQuery,
} from '../../application/queries/get-coupons/get-coupons.query';
import {
  GetCouponsResult,
  toCouponDto,
} from '../../application/queries/get-coupons/get-coupons.handler';
import { ValidateCouponQuery } from '../../application/queries/validate-coupon/validate-coupon.query';
import {
  CouponIdDto,
  CouponInputDto,
  GetCouponsDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '../dtos/coupon.dto';

/** gRPC truyền ngày dưới dạng chuỗi ISO; domain cần Date. */
const toCouponInput = (payload: CouponInputDto): CouponInput => ({
  code: payload.code,
  type: payload.type as CouponType,
  value: payload.value,
  minOrderAmount: payload.minOrderAmount,
  maxDiscount: payload.maxDiscount,
  startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
  expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
  usageLimit: payload.usageLimit,
  isActive: payload.isActive,
});
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { CheckoutDto } from '../dtos/checkout.dto';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { OrderUpdateStatusEventDto } from '../dtos/update-status.dto';
import { UpdateStatusCommand } from '../../application/commands/update-status/update-status.command';
import { getPaymentDto } from '../dtos/get-checkout.dto';
import { GetOrderPaymentQuery } from '../../application/queries/get-order-checkout/get-order-payment.query';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { OrderGrpcExceptionFilter } from '../filters/order-grpc-exception.filter';
import { GetOrdersByAdminQuery } from '../../application/queries/get-orders-admin/get-orders-admin.query';
import { GetOrdersAdminDto } from '../dtos/get-order-admin.dto';
import { getOrderDto } from '../dtos/get-order.dto';
import { GetOrderQuery } from '../../application/queries/get-order/get-order.query';
import { getMyOrderDto } from '../dtos/get-my-order.dto';
import { GetOrdersByAdminResult } from '../../application/queries/get-orders-admin/get-orders-admin.handler';
import { HandlePaymentCommand } from '../../application/commands/handle-payment/handle-payment.command';
import { HandleWebhookEventDto } from '../dtos/handler-webhook.dto';
import { GetOrdersByUserIdDto } from '../dtos/get-orders-by-user.dto';
import { GetMyOrdersQuery } from '../../application/queries/get-my-orders/get-my-orders.query';
import { GetMyOrdersResult } from '../../application/queries/get-my-orders/get-my-orders.handler';

@Controller('order')
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(OrderGrpcExceptionFilter)
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Add to cart' })
  @ApiResponse({ status: 200, description: 'Add to cart success' })
  // @UserData() user: JwtPayload,
  createOrder(@Req() req: Request, @Body() body: CheckoutDto) {
    return this.commandBus.execute(
      new CheckoutCommand(
        'e6d14eb9-268c-4a74-88b0-4b0d9731443b',
        'anhkyohauik17@gmail.com',
        body.shippingAddress,
        body.billingAddress,
        body.paymentMethod,
        body.notes,
        body.couponCode,
      ),
    );
  }

  @GrpcMethod('OrderService', 'getCoupons')
  async getCouponsGrpc(@Payload() payload: GetCouponsDto) {
    const result: GetCouponsResult = await this.queryBus.execute(
      new GetCouponsQuery(payload.search, payload.page ?? 1, payload.limit ?? 20),
    );

    return {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    };
  }

  @GrpcMethod('OrderService', 'createCoupon')
  async createCouponGrpc(@Payload() payload: CouponInputDto) {
    const coupon: Coupon = await this.commandBus.execute(
      new CreateCouponCommand(toCouponInput(payload)),
    );

    return { data: toCouponDto(coupon) };
  }

  @GrpcMethod('OrderService', 'updateCoupon')
  async updateCouponGrpc(@Payload() payload: UpdateCouponDto) {
    const coupon: Coupon = await this.commandBus.execute(
      new UpdateCouponCommand(payload.couponId, toCouponInput(payload.input)),
    );

    return { data: toCouponDto(coupon) };
  }

  @GrpcMethod('OrderService', 'deleteCoupon')
  async deleteCouponGrpc(@Payload() payload: CouponIdDto) {
    return this.commandBus.execute(new DeleteCouponCommand(payload.couponId));
  }

  @GrpcMethod('OrderService', 'validateCoupon')
  async validateCouponGrpc(@Payload() payload: ValidateCouponDto) {
    return this.queryBus.execute(new ValidateCouponQuery(payload.code, payload.subtotal));
  }

  @GrpcMethod('OrderService', 'getShippingQuote')
  getShippingQuoteGrpc(@Payload() payload: { amount: number }) {
    return {
      fee: calculateShippingFee(payload.amount ?? 0),
      freeThreshold: SHIPPING_FREE_THRESHOLD,
    };
  }

  @GrpcMethod('OrderService', 'checkout')
  async checkout(data: any) {
    return this.commandBus.execute(
      new CheckoutCommand(
        data.userId,
        data.email,
        data.shippingAddress,
        data.billingAddress,
        data.paymentMethod,
        data.notes,
        data.couponCode,
      ),
    );
  }

  @GrpcMethod('OrderService', 'getOrderPayment')
  async getOrderPayment(data: getPaymentDto) {
    return this.queryBus.execute(new GetOrderPaymentQuery(data.userId, data.orderId));
  }
  @GrpcMethod('OrderService', 'getOrdersAdmin')
  async getOrdersAdmin(
    @Payload()
    payload: GetOrdersAdminDto,
  ) {
    const result: GetOrdersByAdminResult = await this.queryBus.execute(
      new GetOrdersByAdminQuery(
        payload.search,
        payload.status,
        payload.orderBy,
        payload.page,
        payload.limit,
      ),
    );

    return {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    };
  }

  @GrpcMethod('OrderService', 'getOrder')
  async getOrder(data: getOrderDto) {
    return this.queryBus.execute(new GetOrderQuery(data.orderId));
  }

  @GrpcMethod('OrderService', 'getMyOrder')
  async getMyOrder(data: getMyOrderDto) {
    return this.queryBus.execute(new GetOrderQuery(data.orderId));
  }

  @EventPattern('order.update-status')
  async handlePaymentSucceeded(@Payload() payload: HandleWebhookEventDto) {
    await this.commandBus.execute(
      new HandlePaymentCommand(
        payload.eventId,
        payload.orderId,
        payload.status,
        payload.paymentStatus,
        payload.paymentTransactionId,
        payload.paymentProvider,
      ),
    );
  }

  @GrpcMethod('OrderService', 'updateOrderStatus')
  async updateOrderStatus(@Payload() payload: OrderUpdateStatusEventDto) {
    await this.commandBus.execute(new UpdateStatusCommand(payload.orderId, payload.status));
  }

  @GrpcMethod('OrderService', 'getOrdersByUserId')
  async getOrdersByUserId(
    @Payload()
    payload: GetOrdersByUserIdDto,
  ) {
    const result: GetMyOrdersResult = await this.queryBus.execute(
      new GetMyOrdersQuery(payload.userId, payload.status, payload.page, payload.limit),
    );

    return {
      data: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    };
  }
}
