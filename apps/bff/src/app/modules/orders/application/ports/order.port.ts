import {
  CheckoutGrpcRequest,
  CheckoutGrpcResponse,
  CouponGrpcDto,
  CouponIdGrpcRequest,
  CouponIdGrpcResponse,
  CouponInputGrpcRequest,
  CouponResponse,
  CouponsResponse,
  GetCouponsGrpcRequest,
  UpdateCouponGrpcRequest,
  ValidateCouponGrpcRequest,
  ValidateCouponGrpcResponse,
  ShippingQuoteGrpcRequest,
  ShippingQuoteGrpcResponse,
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

  abstract getCoupons(data: GetCouponsGrpcRequest): Promise<CouponsResponse>;

  abstract createCoupon(data: CouponInputGrpcRequest): Promise<CouponResponse>;

  abstract updateCoupon(data: UpdateCouponGrpcRequest): Promise<CouponResponse>;

  abstract deleteCoupon(data: CouponIdGrpcRequest): Promise<CouponIdGrpcResponse>;

  abstract validateCoupon(data: ValidateCouponGrpcRequest): Promise<ValidateCouponGrpcResponse>;

  abstract getShippingQuote(data: ShippingQuoteGrpcRequest): Promise<ShippingQuoteGrpcResponse>;
}
