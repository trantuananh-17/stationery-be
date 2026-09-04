import { QueryResult } from '@common/interfaces/common/pagination.interface';

import { Review } from '../../../domain/entities/review.entity';
import { ReviewReadModel, ReviewSummaryReadModel } from '../../read-models/review.read-model';

export abstract class IReviewQueryRepository {
  abstract findByProduct(
    productId: string,
    page: number,
    limit: number,
  ): Promise<QueryResult<ReviewReadModel>>;

  abstract findSummary(productId: string): Promise<ReviewSummaryReadModel>;

  abstract findOneByUser(productId: string, userId: string): Promise<Review | null>;
}
