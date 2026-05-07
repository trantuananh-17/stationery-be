import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetOrderGrpcRequest,
  GetOrdersAdminGrpcRequest,
  OrderDetailGrpcResponse,
  OrdersAdminGrpcResponse,
} from './dtos/order.dto';

export abstract class OrderPort {
  abstract checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse>;
  abstract getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse>;
  abstract getOrder(data: GetOrderGrpcRequest): Promise<OrderDetailGrpcResponse>;
}
