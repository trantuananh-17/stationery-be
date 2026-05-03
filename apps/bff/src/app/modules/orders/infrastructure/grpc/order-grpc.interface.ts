import { Observable } from 'rxjs';
import { CheckoutGrpcRequest, CheckoutGrpcResponse } from '../../applications/ports/dtos/order.dto';

export interface OrderGrpcService {
  checkout(data: CheckoutGrpcRequest): Observable<CheckoutGrpcResponse>;
}
