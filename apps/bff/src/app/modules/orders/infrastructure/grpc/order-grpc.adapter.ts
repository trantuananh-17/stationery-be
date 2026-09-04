import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPort } from '../../application/ports/order.port';
import { OrderGrpcService } from './order-grpc.interface';
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

@Injectable()
export class OrderGrpcAdapter implements OrderPort, OnModuleInit {
  private orderService: OrderGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.ORDER_SERVICE)
    private readonly orderClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.orderService = this.orderClient.getService<OrderGrpcService>('OrderService');
  }

  checkout(data: CheckoutGrpcRequest): Promise<CheckoutGrpcResponse> {
    return firstValueFrom(this.orderService.checkout(data));
  }

  updateOrderStatus(data: UpdateOrderStatusRequest): Promise<void> {
    return firstValueFrom(this.orderService.updateOrderStatus(data));
  }

  getOrdersAdmin(data: GetOrdersAdminGrpcRequest): Promise<OrdersAdminGrpcResponse> {
    return firstValueFrom(this.orderService.getOrdersAdmin(data));
  }

  getOrder(data: GetOrderGrpcRequest): Promise<OrderDetailGrpcResponse> {
    return firstValueFrom(this.orderService.getOrder(data));
  }

  getMyOrder(data: GetMyOrderGrpcRequest): Promise<OrderDetailGrpcResponse> {
    return firstValueFrom(this.orderService.getMyOrder(data));
  }

  getOrdersByUserId(data: GetOrdersByUserIdGrpcRequest): Promise<OrdersByUserIdGrpcResponse> {
    return firstValueFrom(this.orderService.getOrdersByUserId(data));
  }

  getCoupons(data: GetCouponsGrpcRequest): Promise<CouponsResponse> {
    return firstValueFrom(this.orderService.getCoupons(data));
  }

  createCoupon(data: CouponInputGrpcRequest): Promise<CouponResponse> {
    return firstValueFrom(this.orderService.createCoupon(data));
  }

  updateCoupon(data: UpdateCouponGrpcRequest): Promise<CouponResponse> {
    return firstValueFrom(this.orderService.updateCoupon(data));
  }

  deleteCoupon(data: CouponIdGrpcRequest): Promise<CouponIdGrpcResponse> {
    return firstValueFrom(this.orderService.deleteCoupon(data));
  }

  validateCoupon(data: ValidateCouponGrpcRequest): Promise<ValidateCouponGrpcResponse> {
    return firstValueFrom(this.orderService.validateCoupon(data));
  }

  getShippingQuote(data: ShippingQuoteGrpcRequest): Promise<ShippingQuoteGrpcResponse> {
    return firstValueFrom(this.orderService.getShippingQuote(data));
  }
}
