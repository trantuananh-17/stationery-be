import { CreatePaymentIntentUseCase } from './../../application/create-payment.usecase';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserData } from '@common/decorators/user-data.decorator';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreatePaymentIntentDto } from '../dtos/create-intent.dto';
import { CreatePaymentIntentGrpcResponse } from '../../application/ports/dtos/payment.dto';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly createPaymentIntentUseCase: CreatePaymentIntentUseCase) {}

  @Post('create-intent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiOkResponse({ type: ResponseDto<CreatePaymentIntentGrpcResponse> })
  @HttpCode(HttpStatus.OK)
  async createPaymentIntent(@UserData() user: JwtPayload, @Body() body: CreatePaymentIntentDto) {
    const result = await this.createPaymentIntentUseCase.execute({
      orderId: body.orderId,
      userId: user.userId,
    });

    Logger.log(`CreatePaymentIntent: ${JSON.stringify(result)}`);

    return result;
  }
}
