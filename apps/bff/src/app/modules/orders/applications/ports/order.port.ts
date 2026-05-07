import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetOrdersAdminGrpcRequest,
  OrdersAdminGrpcResponse,
} from './dtos/order.dto';

export abstract class OrderPort {
  abstract checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse>;
  abstract getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse>;
}
