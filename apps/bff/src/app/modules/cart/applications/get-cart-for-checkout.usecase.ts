import { Inject, Injectable } from '@nestjs/common';
import { CartPort } from './ports/cart.port';
import { GetCartForCheckoutRequest, GetCartForCheckoutResponse } from './ports/dtos/cart.dto';

@Injectable()
export class GetCartForCheckoutUseCase {
  constructor(
    @Inject(CartPort)
    private readonly cartPort: CartPort,
  ) {}

  execute(data: GetCartForCheckoutRequest): Promise<GetCartForCheckoutResponse> {
    return this.cartPort.getCartForCheckout(data);
  }
}
