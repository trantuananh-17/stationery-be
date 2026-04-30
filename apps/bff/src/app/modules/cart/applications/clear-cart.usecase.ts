import { ClearCartRequest, GetCartResponse } from './ports/dtos/cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';

@Injectable()
export class ClearCartUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: ClearCartRequest): Promise<GetCartResponse> {
    return this.cartPort.clearCart(data);
  }
}
