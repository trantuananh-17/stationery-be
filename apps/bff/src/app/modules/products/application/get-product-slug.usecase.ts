import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from './ports/product.port';
import { GetProductBySlugBodyDto, ProductInfoResponse } from './ports/dtos/product.dto';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(data: GetProductBySlugBodyDto): Promise<ProductInfoResponse> {
    return this.productPort.getProductBySlug(data);
  }
}
