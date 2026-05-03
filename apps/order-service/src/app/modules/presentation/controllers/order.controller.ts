import { Body, Controller, Post, Req } from '@nestjs/common';
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

@Controller()
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('order/checkout')
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

  @EventPattern('order.update-status')
  async handlePaymentSucceeded(@Payload() payload: OrderUpdateStatusEventDto) {
    await this.commandBus.execute(
      new UpdateStatusCommand(
        payload.orderId,
        payload.status,
        payload.paymentStatus,
        payload.paymentTransactionId,
        payload.paymentProvider,
      ),
    );
  }
}
