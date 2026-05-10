import { ROLE } from '@common/constants/enums/role.enum';
import { Roles } from '@common/decorators/role.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RoleGuard } from '@common/guards/role.guard';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CheckoutUseCase } from '../../applications/checkout.usecase';
import { GetMyOrderUseCase } from '../../applications/get-my-order.usecase';
import { GetOrderUseCase } from '../../applications/get-order.usecase';
import { GetOrdersAdminUseCase } from '../../applications/get-orders-admin.usecase';
import {
  CheckoutGrpcResponse,
  OrderDetailGrpcResponse,
  OrdersAdminGrpcResponse,
  OrdersByUserIdGrpcResponse,
} from '../../applications/ports/dtos/order.dto';
import { CheckoutDto } from '../dtos/checkout.dto';
import { GetOrderDto } from '../dtos/get-order.dto';
import { GetOrdersAdminDto } from '../dtos/get-orders-admin.dto';
import { OrderUpdateStatusDto } from '../dtos/update-status.dto';
import { UpdateOrderStatusUseCase } from '../../applications/update-order-status.usecase';
import { UserPort } from '../../../user/application/ports/user.port';
import { GetOrdersByUserIdUseCase } from '../../applications/get-orders-userid.usecase';
import { GetOrdersByUserIdDto } from '../dtos/get-orders-by-user-id.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly checkoutUseCase: CheckoutUseCase,
    private readonly getOrdersAdminUseCase: GetOrdersAdminUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getMyOrderUseCase: GetMyOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getOrdersByUserIdUseCase: GetOrdersByUserIdUseCase,
  ) {}

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Checkout order' })
  @ApiOkResponse({ type: ResponseDto<CheckoutGrpcResponse> })
  @HttpCode(HttpStatus.OK)
  async checkout(@UserData() user: any, @Body() body: CheckoutDto) {
    console.log(user.userId);
    console.log(user.email);

    const result = await this.checkoutUseCase.execute({
      userId: user.userId,
      email: user.email,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      couponCode: body.couponCode,
    });

    Logger.log(`Checkout request: ${JSON.stringify(result)}`);

    return result;
  }

  @Put('/:orderId/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update order status' })
  @ApiOkResponse({ type: ResponseDto<boolean> })
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('orderId') orderId: string, @Body() body: OrderUpdateStatusDto) {
    const result = await this.updateOrderStatusUseCase.execute({
      orderId,
      status: body.status,
    });

    Logger.log(`Update order status request: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('admin')
  @ApiOperation({
    summary: 'Get orders admin',
  })
  @ApiOkResponse({
    type: ResponseDto<OrdersAdminGrpcResponse>,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getOrdersAdmin(
    @Query()
    query: GetOrdersAdminDto,
  ) {
    const normalizedQuery = {
      ...query,
      status: query.status?.trim().toUpperCase(),
    };

    const result = await this.getOrdersAdminUseCase.execute(normalizedQuery);

    Logger.log(`Get orders admin: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('admin/:orderId')
  @ApiOperation({
    summary: 'Get order detail for admin',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
  })
  @ApiOkResponse({
    type: ResponseDto<OrderDetailGrpcResponse>,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @HttpCode(HttpStatus.OK)
  async getOrder(
    @Param()
    params: GetOrderDto,
  ) {
    const result = await this.getOrderUseCase.execute({
      orderId: params.orderId,
    });

    Logger.log(`Get order detail: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('my-order/:orderId')
  @ApiOperation({
    summary: 'Get order detail for admin',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
  })
  @ApiOkResponse({
    type: ResponseDto<OrderDetailGrpcResponse>,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  async getMyOrder(
    @UserData() user: JwtPayload,
    @Param()
    params: GetOrderDto,
  ) {
    const result = await this.getMyOrderUseCase.execute({
      orderId: params.orderId,
      userId: user.userId,
    });

    Logger.log(`Get order detail: ${JSON.stringify(result)}`);

    return result;
  }

  @Get('my-orders')
  @ApiOperation({
    summary: 'Get my orders',
  })
  @ApiOkResponse({
    type: ResponseDto<OrdersByUserIdGrpcResponse>,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getOrdersByUserId(@UserData() user: JwtPayload, @Query() query: GetOrdersByUserIdDto) {
    const result = await this.getOrdersByUserIdUseCase.execute({
      userId: user.userId,
      status: query.status,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    Logger.log(`Get my orders: ${JSON.stringify(result)}`);

    return result;
  }
}
