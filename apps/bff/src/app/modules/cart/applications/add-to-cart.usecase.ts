import { AddToCartRequest, GetCartResponse } from './ports/dtos/cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: AddToCartRequest): Promise<GetCartResponse> {
    return this.cartPort.addToCart(data);
  }
}
