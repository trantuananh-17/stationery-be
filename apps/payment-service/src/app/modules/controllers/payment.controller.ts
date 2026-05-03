import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { PaymentService } from '../services/payment.service';
import { CreateCheckoutSessionRequest } from '../interfaces/stripe.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
// @UseInterceptors(GrpcLoggingInterceptor)
// @UseFilters(PaymentGrpcExceptionFilter)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['orderId', 'clientEmail', 'lineItems'],
      properties: {
        orderId: {
          type: 'string',
          example: 'order_123',
        },
        clientEmail: {
          type: 'string',
          example: 'test@gmail.com',
        },
        lineItems: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'price', 'quantity'],
            properties: {
              name: {
                type: 'string',
                example: 'Bút bi',
              },
              price: {
                type: 'number',
                example: 10000,
              },
              quantity: {
                type: 'number',
                example: 2,
              },
            },
          },
        },
      },
    },
  })
  async createCheckoutSession(@Body() body: CreateCheckoutSessionRequest) {
    const data = await this.paymentService.createCheckoutSession(body);

    return {
      data,
      message: 'Create Checkout Session Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @GrpcMethod('PaymentService', 'createCheckoutSession')
  async createCheckoutSessionGrpc(@Payload() payload: CreateCheckoutSessionRequest) {
    return await this.paymentService.createCheckoutSession(payload);
  }
}
