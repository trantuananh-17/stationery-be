import { Injectable } from '@nestjs/common';

import { DeleteReviewBodyDto, ProductIdResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class DeleteReviewUseCase {
  constructor(private readonly productPort: ProductPort) {}

  execute(data: DeleteReviewBodyDto): Promise<ProductIdResponse> {
    return this.productPort.deleteReview(data);
  }
}
