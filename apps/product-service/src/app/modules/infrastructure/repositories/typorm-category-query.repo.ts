import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICategoryQueryRepository } from '../../application/ports/repositories/category-query.repo';
import { CategoryOrmEntity } from '../entities/typeorm-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmCategoryQueryRepository implements ICategoryQueryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repo: Repository<CategoryOrmEntity>,
  ) {}
  async findCategoryExist(categoryId: string): Promise<boolean> {
    return this.repo.exist({
      where: { id: categoryId },
    });
  }
}
