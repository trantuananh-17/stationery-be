import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetMyOrderGrpcRequest,
  GetOrderGrpcRequest,
  GetOrdersAdminGrpcRequest,
  OrderDetailGrpcResponse,
  OrdersAdminGrpcResponse,
  UpdateOrderStatusRequest,
} from './dtos/order.dto';

export abstract class OrderPort {
  abstract checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse>;
  abstract getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse>;
  abstract getOrder(data: GetOrderGrpcRequest): Promise<OrderDetailGrpcResponse>;
  abstract getMyOrder(data: GetMyOrderGrpcRequest): Promise<OrderDetailGrpcResponse>;
  abstract updateOrderStatus(data: UpdateOrderStatusRequest): Promise<void>;
}
