import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReviewReadModel, ReviewSummaryReadModel } from '../../read-models/review.read-model';
import { IReviewQueryRepository } from '../../ports/repositories/review-query.repo';
import { GetReviewsQuery } from './get-reviews.query';

export type GetReviewsResult = {
  data: ReviewReadModel[];
  summary: ReviewSummaryReadModel;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

@QueryHandler(GetReviewsQuery)
export class GetReviewsHandler implements IQueryHandler<GetReviewsQuery, GetReviewsResult> {
  constructor(private readonly reviewQueryRepo: IReviewQueryRepository) {}

  async execute(query: GetReviewsQuery): Promise<GetReviewsResult> {
    const { productId, page, limit } = query;

    const [result, summary] = await Promise.all([
      this.reviewQueryRepo.findByProduct(productId, page, limit),
      this.reviewQueryRepo.findSummary(productId),
    ]);

    return {
      data: result.items,
      summary,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
