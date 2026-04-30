import { GetCartResponse, MergeCartRequest } from './ports/dtos/cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';

@Injectable()
export class MergeCartUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: MergeCartRequest): Promise<GetCartResponse> {
    return this.cartPort.mergeCart(data);
  }
}
