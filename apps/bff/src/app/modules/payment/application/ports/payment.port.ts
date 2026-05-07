import {
  CreatePaymentIntentGrpcRequest,
  CreatePaymentIntentGrpcResponse,
} from './dtos/payment.dto';

export abstract class PaymentPort {
  abstract createPaymentIntent(
    data: CreatePaymentIntentGrpcRequest,
  ): Promise<CreatePaymentIntentGrpcResponse>;
}
