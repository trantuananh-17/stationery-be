import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CheckoutCartResult } from '../../application/ports/contracts/cart.contract';
import { ICartGrpcPort } from '../../application/ports/grpc/cart-grpc.port';
import { ICartGrpcService } from './cart-grpc.interface';

@Injectable()
export class CartGrpcAdapter implements ICartGrpcPort, OnModuleInit {
  private cartService: ICartGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.CART_SERVICE)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.cartService = this.userClient.getService<ICartGrpcService>('CartService');
  }

  getCartForCheckout(data: { userId: string }): Promise<CheckoutCartResult> {
    return firstValueFrom(this.cartService.getCartForCheckout(data));
  }
}
