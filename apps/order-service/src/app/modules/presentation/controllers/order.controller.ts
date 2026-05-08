import { Body, Controller, Post, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { CheckoutCommand } from '../../application/commands/checkout/checkout.command';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { CheckoutDto } from '../dtos/checkout.dto';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { OrderUpdateStatusEventDto } from '../dtos/updateStatus.dto';
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
  async handlePaymentSucceeded(@Payload() payload: OrderUpdateStatusEventDto) {
    await this.commandBus.execute(
      new UpdateStatusCommand(
        payload.eventId,
        payload.orderId,
        payload.status,
        payload.paymentStatus,
        payload.paymentTransactionId,
        payload.paymentProvider,
      ),
    );
  }
}
