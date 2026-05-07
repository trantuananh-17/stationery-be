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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCheckoutSessionRequest } from '../../interfaces/stripe.interface';
import { PaymentService } from '../../services/payment.service';
import { CreatePaymentRequest } from '../dtos/create-intent.dto';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { PaymentGrpcExceptionFilter } from '../filters/payment.filter';

@ApiTags('Payments')
@Controller('payments')
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(PaymentGrpcExceptionFilter)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  async createCheckoutSession(@Body() body: CreateCheckoutSessionRequest) {
    const data = await this.paymentService.createCheckoutSession(body);

    return {
      data,
      message: 'Create Checkout Session Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post('payment-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe payment intent' })
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
  async createPaymentIntent(@Body() body: CreatePaymentRequest) {
    console.log(body);

    const data = await this.paymentService.createPaymentIntent(body);

    return data;
  }

  @GrpcMethod('PaymentService', 'createPaymenSession')
  async createCheckoutSessionGrpc(@Payload() payload: CreateCheckoutSessionRequest) {
    return await this.paymentService.createCheckoutSession(payload);
  }

  @GrpcMethod('PaymentService', 'createPaymentIntent')
  async createCheckoutIntentGrpc(@Payload() payload: CreatePaymentRequest) {
    return await this.paymentService.createPaymentIntent(payload);
  }
}
