import { Review } from '../../../domain/entities/review.entity';

export abstract class IReviewCommandRepository {
  abstract save(review: Review): Promise<void>;

  abstract delete(productId: string, userId: string): Promise<boolean>;
}
