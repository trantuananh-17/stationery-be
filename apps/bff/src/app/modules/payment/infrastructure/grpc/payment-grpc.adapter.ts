import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaymentGrpcService } from './payment-grpc.interface';
import { PaymentPort } from '../../application/ports/payment.port';
import {
  CreatePaymentIntentGrpcRequest,
  CreatePaymentIntentGrpcResponse,
} from '../../application/ports/dtos/payment.dto';

@Injectable()
export class PaymentGrpcAdapter implements PaymentPort, OnModuleInit {
  private paymentService: PaymentGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.PAYMENT_SERVICE)
    private readonly paymentClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.paymentService = this.paymentClient.getService<PaymentGrpcService>('PaymentService');
  }

  createPaymentIntent(
    data: CreatePaymentIntentGrpcRequest,
  ): Promise<CreatePaymentIntentGrpcResponse> {
    return firstValueFrom(this.paymentService.createPaymentIntent(data));
  }
}
