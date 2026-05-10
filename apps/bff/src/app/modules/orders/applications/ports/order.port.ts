import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  GetMyOrderGrpcRequest,
  GetOrderGrpcRequest,
  GetOrdersAdminGrpcRequest,
  GetOrdersByUserIdGrpcRequest,
  OrderDetailGrpcResponse,
  OrdersAdminGrpcResponse,
  OrdersByUserIdGrpcResponse,
  UpdateOrderStatusRequest,
} from './dtos/order.dto';

export abstract class OrderPort {
  abstract checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse>;
  abstract getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse>;
  abstract getOrder(data: GetOrderGrpcRequest): Promise<OrderDetailGrpcResponse>;
  abstract getMyOrder(data: GetMyOrderGrpcRequest): Promise<OrderDetailGrpcResponse>;
  abstract updateOrderStatus(data: UpdateOrderStatusRequest): Promise<void>;
  abstract getOrdersByUserId(
    data: GetOrdersByUserIdGrpcRequest,
  ): Promise<OrdersByUserIdGrpcResponse>;
}
