import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ICategoryPerformanceQueryRepository } from '../../../applications/ports/queries/category-performance-query.repository';
import { CategoryPerformanceOrmEntity } from '../../entities/category-performance.orm-entity';
import { CategoryRevenueDto } from '../../../applications/ports/dtos/category-performance.dto';

@Injectable()
export class TypeOrmCategoryPerformanceQueryRepository
  implements ICategoryPerformanceQueryRepository
{
  constructor(
    @InjectRepository(CategoryPerformanceOrmEntity)
    private readonly repo: Repository<CategoryPerformanceOrmEntity>,
  ) {}

  async getRevenueByCategory(startDate: string, endDate: string): Promise<CategoryRevenueDto[]> {
    const raws = await this.repo
      .createQueryBuilder('categoryPerformance')
      .select('categoryPerformance.categoryId', 'categoryId')
      .addSelect('categoryPerformance.categoryName', 'categoryName')
      .addSelect('SUM(categoryPerformance.totalRevenue)', 'totalRevenue')
      .where('categoryPerformance.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('categoryPerformance.categoryId')
      .addGroupBy('categoryPerformance.categoryName')
      .orderBy('SUM(categoryPerformance.totalRevenue)', 'DESC')
      .getRawMany();

    return raws.map((raw) => ({
      categoryId: raw.categoryId,

      categoryName: raw.categoryName,

      totalRevenue: Number(raw.totalRevenue),
    }));
  }
}
