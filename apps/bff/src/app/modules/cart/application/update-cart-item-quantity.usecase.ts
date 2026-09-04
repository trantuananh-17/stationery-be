import { GetCartResponse, UpdateCartItemQuantityRequest } from './ports/dtos/cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';

@Injectable()
export class UpdateCartItemQuantityUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: UpdateCartItemQuantityRequest): Promise<GetCartResponse> {
    return this.cartPort.updateCartItemQuantity(data);
  }
}
