import { Observable } from 'rxjs';
import {
  CreatePaymentIntentGrpcRequest,
  CreatePaymentIntentGrpcResponse,
} from '../../application/ports/dtos/payment.dto';

export interface PaymentGrpcService {
  createPaymentIntent(
    data: CreatePaymentIntentGrpcRequest,
  ): Observable<CreatePaymentIntentGrpcResponse>;
}
