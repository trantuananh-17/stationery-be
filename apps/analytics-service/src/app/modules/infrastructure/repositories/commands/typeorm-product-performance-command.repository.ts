import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IProductPerformanceCommandRepository } from '../../../applications/ports/commands/product-performance-command.repository';
import { ProductPerformanceOrmEntity } from '../../entities/product-performance.orm-entity';
import { ProductPerformance } from '../../../domain/entities/product-performance.entity';

@Injectable()
export class TypeOrmProductPerformanceCommandRepository
  implements IProductPerformanceCommandRepository
{
  constructor(
    @InjectRepository(ProductPerformanceOrmEntity)
    private readonly repo: Repository<ProductPerformanceOrmEntity>,
  ) {}

  async findByProductAndDate(productId: string, date: string): Promise<ProductPerformance | null> {
    const entity = await this.repo.findOne({
      where: {
        productId,
        bucketDate: date,
      },
    });

    if (!entity) {
      return null;
    }

    return ProductPerformance.restore({
      id: entity.id,

      bucketDate: entity.bucketDate,

      productId: entity.productId,

      productName: entity.productName,

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

  async save(performance: ProductPerformance): Promise<void> {
    await this.repo.save({
      id: performance.id,

      bucketDate: performance.bucketDate,

      productId: performance.productId,

      productName: performance.productName,

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
