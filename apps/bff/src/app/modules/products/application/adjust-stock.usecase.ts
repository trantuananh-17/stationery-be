import { Injectable } from '@nestjs/common';

import { AdjustStockBodyDto, AdjustStockResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class AdjustStockUseCase {
  constructor(private readonly productPort: ProductPort) {}

  execute(data: AdjustStockBodyDto): Promise<AdjustStockResponse> {
    return this.productPort.adjustStock(data);
  }
}
