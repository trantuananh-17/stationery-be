import { GetCartResponse, RemoveCartItemRequest } from './ports/dtos/cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: RemoveCartItemRequest): Promise<GetCartResponse> {
    return this.cartPort.removeCartItem(data);
  }
}
