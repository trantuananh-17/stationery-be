import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserData } from '@common/decorators/user-data.decorator';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';

import { CheckoutDto } from '../dtos/checkout.dto';
import { CheckoutUseCase } from '../../applications/checkout.usecase';
import { CheckoutGrpcResponse } from '../../applications/ports/dtos/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly checkoutUseCase: CheckoutUseCase) {}

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
}
