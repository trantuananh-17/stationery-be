import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from './ports/product.port';
import { GetProductsBodyDto, GetProductsResponse } from './ports/dtos/product.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(query: GetProductsBodyDto): Promise<GetProductsResponse> {
    return this.productPort.getProducts(query);
  }
}
