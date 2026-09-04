import { Observable } from 'rxjs';
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
} from '../../application/ports/dtos/order.dto';

export interface OrderGrpcService {
  checkout(data: CheckoutGrpcRequest): Observable<CheckoutGrpcResponse>;
  getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Observable<OrdersAdminGrpcResponse>;
  getOrder(data: GetOrderGrpcRequest): Observable<OrderDetailGrpcResponse>;
  getMyOrder(data: GetMyOrderGrpcRequest): Observable<OrderDetailGrpcResponse>;
  updateOrderStatus(data: UpdateOrderStatusRequest): Observable<void>;
  getCoupons(data: GetCouponsGrpcRequest): Observable<CouponsResponse>;

  createCoupon(data: CouponInputGrpcRequest): Observable<CouponResponse>;

  updateCoupon(data: UpdateCouponGrpcRequest): Observable<CouponResponse>;

  deleteCoupon(data: CouponIdGrpcRequest): Observable<CouponIdGrpcResponse>;

  validateCoupon(data: ValidateCouponGrpcRequest): Observable<ValidateCouponGrpcResponse>;

  getShippingQuote(data: ShippingQuoteGrpcRequest): Observable<ShippingQuoteGrpcResponse>;

  getOrdersByUserId(data: GetOrdersByUserIdGrpcRequest): Observable<OrdersByUserIdGrpcResponse>;
}
