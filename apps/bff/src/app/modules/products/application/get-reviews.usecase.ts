import { Injectable } from '@nestjs/common';

import { GetReviewsBodyDto, ReviewsResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class GetReviewsUseCase {
  constructor(private readonly productPort: ProductPort) {}

  execute(query: GetReviewsBodyDto): Promise<ReviewsResponse> {
    return this.productPort.getReviews(query);
  }
}
