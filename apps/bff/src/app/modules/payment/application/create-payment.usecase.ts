import { Inject, Injectable } from '@nestjs/common';
import { PaymentPort } from './ports/payment.port';
import {
  CreatePaymentIntentGrpcRequest,
  CreatePaymentIntentGrpcResponse,
} from './ports/dtos/payment.dto';

@Injectable()
export class CreatePaymentIntentUseCase {
  constructor(
    @Inject(PaymentPort)
    private readonly paymentPort: PaymentPort,
  ) {}

  execute(data: CreatePaymentIntentGrpcRequest): Promise<CreatePaymentIntentGrpcResponse> {
    return this.paymentPort.createPaymentIntent(data);
  }
}
