import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  REVIEW_RATING_MAX,
  REVIEW_RATING_MIN,
  Review,
} from '../../../../domain/entities/review.entity';
import { InvalidRatingError, ProductNotFoundError } from '../../../../domain/errors/product.error';
import { IProductQueryRepository } from '../../../ports/repositories/product-query.repo';
import { IReviewCommandRepository } from '../../../ports/repositories/review-command.repo';
import { IReviewQueryRepository } from '../../../ports/repositories/review-query.repo';
import { CreateReviewCommand } from './create-review.command';

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler implements ICommandHandler<CreateReviewCommand> {
  constructor(
    private readonly reviewRepo: IReviewCommandRepository,
    private readonly reviewQueryRepo: IReviewQueryRepository,
    private readonly productRepo: IProductQueryRepository,
  ) {}

  async execute(command: CreateReviewCommand) {
    const { productId, userId, userName, rating, comment } = command;

    if (!Number.isInteger(rating) || rating < REVIEW_RATING_MIN || rating > REVIEW_RATING_MAX) {
      throw new InvalidRatingError(rating);
    }

    const product = await this.productRepo.findRelatedBaseInfoById(productId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    // Mỗi user chỉ có một đánh giá cho mỗi sản phẩm — gửi lại là sửa đánh giá cũ.
    const existing = await this.reviewQueryRepo.findOneByUser(productId, userId);

    if (existing) {
      existing.edit(rating, comment, userName);
      await this.reviewRepo.save(existing);

      return { reviewId: existing.id };
    }

    const review = Review.create({ productId, userId, userName, rating, comment });

    await this.reviewRepo.save(review);

    return { reviewId: review.id };
  }
}
