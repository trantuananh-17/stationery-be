import { Inject, Injectable } from '@nestjs/common';
import { ProductIdResponse, UpdateProductBodyDto } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(data: UpdateProductBodyDto & { id: string }): Promise<ProductIdResponse> {
    return this.productPort.updateProduct(data);
  }
}
