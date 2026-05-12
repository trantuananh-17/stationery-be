import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ISalesPerformanceCommandRepository } from '../../../applications/ports/commands/sales-performance-command.repository';
import { SalesPerformanceOrmEntity } from '../../entities/sales-performance.orm-entity';
import { SalesPerformance } from '../../../domain/entities/sales-performance.entity';

@Injectable()
export class TypeOrmSalesPerformanceCommandRepository
  implements ISalesPerformanceCommandRepository
{
  constructor(
    @InjectRepository(SalesPerformanceOrmEntity)
    private readonly repo: Repository<SalesPerformanceOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<SalesPerformance | null> {
    const entity = await this.repo.findOne({
      where: {
        bucketDate: date,
      },
    });

    if (!entity) {
      return null;
    }

    return SalesPerformance.restore({
      id: entity.id,

      bucketDate: entity.bucketDate,

      revenue: Number(entity.revenue),

      orders: entity.orders,

      estimatedProfit: Number(entity.estimatedProfit),

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(performance: SalesPerformance): Promise<void> {
    await this.repo.save({
      id: performance.id,

      bucketDate: performance.bucketDate,

      revenue: performance.revenue,

      orders: performance.orders,

      estimatedProfit: performance.estimatedProfit,

      createdAt: performance.createdAt,

      updatedAt: performance.updatedAt,
    });
  }
}
