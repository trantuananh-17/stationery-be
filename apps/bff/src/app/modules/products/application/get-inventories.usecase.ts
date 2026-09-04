import { Injectable } from '@nestjs/common';

import { GetInventoriesBodyDto, InventoriesResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class GetInventoriesUseCase {
  constructor(private readonly productPort: ProductPort) {}

  execute(query: GetInventoriesBodyDto): Promise<InventoriesResponse> {
    return this.productPort.getInventories(query);
  }
}
