import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IDailyMetricCommandRepository } from '../../../applications/ports/commands/daily-metric-command.repository';
import { DailyMetricOrmEntity } from '../../entities/daily-metric.orm-entity';
import { DailyMetric } from '../../../domain/entities/daily-metric.entity';

@Injectable()
export class TypeOrmDailyMetricCommandRepository implements IDailyMetricCommandRepository {
  constructor(
    @InjectRepository(DailyMetricOrmEntity)
    private readonly repo: Repository<DailyMetricOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<DailyMetric | null> {
    const entity = await this.repo.findOne({
      where: {
        date,
      },
    });

    if (!entity) {
      return null;
    }

    return DailyMetric.restore({
      id: entity.id,

      date: entity.date,

      totalRevenue: Number(entity.totalRevenue),

      totalOrders: entity.totalOrders,

      newCustomers: entity.newCustomers,

      averageOrderValue: Number(entity.averageOrderValue),

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(metric: DailyMetric): Promise<void> {
    await this.repo.save({
      id: metric.id,

      date: metric.date,

      totalRevenue: metric.totalRevenue,

      totalOrders: metric.totalOrders,

      newCustomers: metric.newCustomers,

      averageOrderValue: metric.averageOrderValue,

      createdAt: metric.createdAt,

      updatedAt: metric.updatedAt,
    });
  }
}
