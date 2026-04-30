import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from './ports/product.port';
import { CreateProductBodyDto } from './ports/dtos/product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductPort)
    private readonly productPort: ProductPort,
  ) {}

  execute(data: CreateProductBodyDto): Promise<void> {
    return this.productPort.createProduct(data);
  }
}
