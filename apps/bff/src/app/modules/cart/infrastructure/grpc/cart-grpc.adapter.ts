import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CartGrpcService } from './cart-grpc.interface';
import {
  AddToCartRequest,
  ClearCartRequest,
  GetCartCountRequest,
  GetCartCountResponse,
  GetCartForCheckoutRequest,
  GetCartForCheckoutResponse,
  GetCartRequest,
  GetCartResponse,
  MergeCartRequest,
  UpdateCartItemQuantityRequest,
  RemoveCartItemRequest,
} from '../../applications/ports/dtos/cart.dto';
import { CartPort } from '../../applications/ports/cart.port';

@Injectable()
export class CartGrpcAdapter implements CartPort, OnModuleInit {
  private cartService: CartGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.CART_SERVICE)
    private readonly cartClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.cartService = this.cartClient.getService<CartGrpcService>('CartService');
  }

  getCart(data: GetCartRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.getCart(data));
  }

  getCartCount(data: GetCartCountRequest): Promise<GetCartCountResponse> {
    return firstValueFrom(this.cartService.getCartCount(data));
  }

  getCartForCheckout(data: GetCartForCheckoutRequest): Promise<GetCartForCheckoutResponse> {
    return firstValueFrom(this.cartService.getCartForCheckout(data));
  }

  addToCart(data: AddToCartRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.addToCart(data));
  }

  updateCartItemQuantity(data: UpdateCartItemQuantityRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.updateCartItemQuantity(data));
  }

  removeCartItem(data: RemoveCartItemRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.removeCartItem(data));
  }

  clearCart(data: ClearCartRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.clearCart(data));
  }

  mergeCart(data: MergeCartRequest): Promise<GetCartResponse> {
    return firstValueFrom(this.cartService.mergeCart(data));
  }
}
