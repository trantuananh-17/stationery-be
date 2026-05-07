import { Observable } from 'rxjs';
import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetOrdersAdminGrpcRequest,
  OrdersAdminGrpcResponse,
} from '../../applications/ports/dtos/order.dto';

export interface OrderGrpcService {
  checkout(data: CheckoutGrpcRequest): Observable<CheckoutGrpcResponse>;
  getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Observable<OrdersAdminGrpcResponse>;
}
