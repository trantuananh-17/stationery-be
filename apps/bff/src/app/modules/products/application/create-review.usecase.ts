import { Injectable } from '@nestjs/common';

import { UserPort } from '../../user/application/ports/user.port';
import { ReviewIdResponse } from './ports/dtos/product.dto';
import { ProductPort } from './ports/product.port';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    private readonly productPort: ProductPort,
    private readonly userPort: UserPort,
  ) {}

  async execute(data: {
    productId: string;
    userId: string;
    rating: number;
    comment: string;
  }): Promise<ReviewIdResponse> {
    // product-service không biết gì về user, nên tên người đánh giá được
    // lấy ở đây và lưu kèm review (denormalize lúc ghi).
    const user = await this.userPort.getUserAuth({ userId: data.userId });

    const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();

    return this.productPort.createReview({
      ...data,
      userName: userName || user?.email || 'Khách hàng',
    });
  }
}
