import { Inject, Injectable } from '@nestjs/common';
import { GetProductByIdBodyDto, ProductMutationResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(data: GetProductByIdBodyDto): Promise<ProductMutationResponse> {
    return this.productPort.deleteProduct(data);
  }
}
