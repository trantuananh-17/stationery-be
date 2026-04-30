import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';
import { GetCartRequest, GetCartResponse } from './ports/dtos/cart.dto';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: GetCartRequest): Promise<GetCartResponse> {
    return this.cartPort.getCart(data);
  }
}
