import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ICategoryPerformanceCommandRepository } from '../../../applications/ports/commands/category-performance-command.repository';
import { CategoryPerformanceOrmEntity } from '../../entities/category-performance.orm-entity';
import { CategoryPerformance } from '../../../domain/entities/category-performanc.entity';

@Injectable()
export class TypeOrmCategoryPerformanceCommandRepository
  implements ICategoryPerformanceCommandRepository
{
  constructor(
    @InjectRepository(CategoryPerformanceOrmEntity)
    private readonly repo: Repository<CategoryPerformanceOrmEntity>,
  ) {}

  async findByCategoryAndDate(
    categoryId: string,
    date: string,
  ): Promise<CategoryPerformance | null> {
    const entity = await this.repo.findOne({
      where: {
        categoryId,
        bucketDate: date,
      },
    });

    if (!entity) {
      return null;
    }

    return CategoryPerformance.restore({
      id: entity.id,

      bucketDate: entity.bucketDate,

      categoryId: entity.categoryId,

      categoryName: entity.categoryName,

      quantitySold: entity.quantitySold,

      totalRevenue: Number(entity.totalRevenue),

      estimatedProfit: Number(entity.estimatedProfit),

      totalOrders: entity.totalOrders,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(performance: CategoryPerformance): Promise<void> {
    await this.repo.save({
      id: performance.id,

      bucketDate: performance.bucketDate,

      categoryId: performance.categoryId,

      categoryName: performance.categoryName,

      quantitySold: performance.quantitySold,

      totalRevenue: performance.totalRevenue,

      estimatedProfit: performance.estimatedProfit,

      totalOrders: performance.totalOrders,

      createdAt: performance.createdAt,

      updatedAt: performance.updatedAt,
    });
  }
}
