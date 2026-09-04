import { Injectable } from '@nestjs/common';

import {
  CouponIdGrpcRequest,
  CouponIdGrpcResponse,
  CouponInputGrpcRequest,
  CouponResponse,
  CouponsResponse,
  GetCouponsGrpcRequest,
  UpdateCouponGrpcRequest,
  ValidateCouponGrpcRequest,
  ValidateCouponGrpcResponse,
  ShippingQuoteGrpcResponse,
} from './ports/dtos/order.dto';
import { OrderPort } from './ports/order.port';

@Injectable()
export class CouponUseCase {
  constructor(private readonly orderPort: OrderPort) {}

  getCoupons(query: GetCouponsGrpcRequest): Promise<CouponsResponse> {
    return this.orderPort.getCoupons(query);
  }

  createCoupon(data: CouponInputGrpcRequest): Promise<CouponResponse> {
    return this.orderPort.createCoupon(data);
  }

  updateCoupon(data: UpdateCouponGrpcRequest): Promise<CouponResponse> {
    return this.orderPort.updateCoupon(data);
  }

  deleteCoupon(data: CouponIdGrpcRequest): Promise<CouponIdGrpcResponse> {
    return this.orderPort.deleteCoupon(data);
  }

  validateCoupon(data: ValidateCouponGrpcRequest): Promise<ValidateCouponGrpcResponse> {
    return this.orderPort.validateCoupon(data);
  }
}

@Injectable()
export class ShippingQuoteUseCase {
  constructor(private readonly orderPort: OrderPort) {}

  getQuote(amount: number): Promise<ShippingQuoteGrpcResponse> {
    return this.orderPort.getShippingQuote({ amount });
  }
}
