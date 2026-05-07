import { Observable } from 'rxjs';
import {
  OrderPaymentGrpcRequest,
  OrderPaymentResponse,
} from '../../applications/ports/dtos/order.dto';

export interface OrderGrpcService {
  getOrderPayment(data: OrderPaymentGrpcRequest): Observable<OrderPaymentResponse>;
}
