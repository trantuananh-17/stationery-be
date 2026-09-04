import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IReviewCommandRepository } from '../../application/ports/repositories/review-command.repo';
import { Review } from '../../domain/entities/review.entity';
import { ReviewOrmEntity } from '../entities/typeorm-review.entity';

@Injectable()
export class TypeOrmReviewCommandRepository implements IReviewCommandRepository {
  constructor(
    @InjectRepository(ReviewOrmEntity)
    private readonly repo: Repository<ReviewOrmEntity>,
  ) {}

  async save(review: Review): Promise<void> {
    await this.repo.save({
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });
  }

  async delete(productId: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ productId, userId });

    return !!result.affected;
  }
}
