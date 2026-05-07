import { Observable } from 'rxjs';
import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetMyOrderGrpcRequest,
  GetOrderGrpcRequest,
  GetOrdersAdminGrpcRequest,
  OrderDetailGrpcResponse,
  OrdersAdminGrpcResponse,
} from '../../applications/ports/dtos/order.dto';

export interface OrderGrpcService {
  checkout(data: CheckoutGrpcRequest): Observable<CheckoutGrpcResponse>;
  getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Observable<OrdersAdminGrpcResponse>;
  getOrder(data: GetOrderGrpcRequest): Observable<OrderDetailGrpcResponse>;
  getMyOrder(data: GetMyOrderGrpcRequest): Observable<OrderDetailGrpcResponse>;
}
