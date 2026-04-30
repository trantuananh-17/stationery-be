import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from './ports/product.port';
import { GetProductByIdBodyDto, ProductInfoResponse } from './ports/dtos/product.dto';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(data: GetProductByIdBodyDto): Promise<ProductInfoResponse> {
    return this.productPort.getProductById(data);
  }
}
