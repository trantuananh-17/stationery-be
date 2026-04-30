import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';
import { GetCartCountRequest, GetCartCountResponse } from './ports/dtos/cart.dto';

@Injectable()
export class GetCartCountUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: GetCartCountRequest): Promise<GetCartCountResponse> {
    return this.cartPort.getCartCount(data);
  }
}
