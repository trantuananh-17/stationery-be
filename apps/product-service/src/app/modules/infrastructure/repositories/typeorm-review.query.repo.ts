import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IReviewQueryRepository } from '../../application/ports/repositories/review-query.repo';
import {
  ReviewReadModel,
  ReviewSummaryReadModel,
} from '../../application/read-models/review.read-model';
import { Review } from '../../domain/entities/review.entity';
import { ReviewOrmEntity } from '../entities/typeorm-review.entity';

@Injectable()
export class TypeOrmReviewQueryRepository implements IReviewQueryRepository {
  constructor(
    @InjectRepository(ReviewOrmEntity)
    private readonly repo: Repository<ReviewOrmEntity>,
  ) {}

  async findByProduct(
    productId: string,
    page: number,
    limit: number,
  ): Promise<QueryResult<ReviewReadModel>> {
    const [rows, total] = await this.repo.findAndCount({
      where: { productId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const items = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.createdAt,
    }));

    return { items, total };
  }

  async findSummary(productId: string): Promise<ReviewSummaryReadModel> {
    const result = await this.repo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.product_id = :productId', { productId })
      .getRawOne<{ average: string | null; count: string }>();

    const average = Number(result?.average ?? 0);
    const count = Number(result?.count ?? 0);

    return {
      average: count ? Math.round(average * 10) / 10 : 0,
      count,
    };
  }

  async findOneByUser(productId: string, userId: string): Promise<Review | null> {
    const row = await this.repo.findOne({ where: { productId, userId } });

    if (!row) return null;

    return Review.restore({
      id: row.id,
      productId: row.productId,
      userId: row.userId,
      userName: row.userName,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
