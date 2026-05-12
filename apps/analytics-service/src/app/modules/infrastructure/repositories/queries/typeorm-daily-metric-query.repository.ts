import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IDailyMetricQueryRepository } from '../../../applications/ports/queries/daily-metric-query.repository';
import { DailyMetricOrmEntity } from '../../entities/daily-metric.orm-entity';
import {
  DailyMetricGrowthDto,
  DailyMetricSummaryDto,
} from '../../../applications/ports/dtos/daily-metric.dto';

@Injectable()
export class TypeOrmDailyMetricQueryRepository implements IDailyMetricQueryRepository {
  constructor(
    @InjectRepository(DailyMetricOrmEntity)
    private readonly repo: Repository<DailyMetricOrmEntity>,
  ) {}

  async getSummary(startDate: string, endDate: string): Promise<DailyMetricSummaryDto> {
    const raw = await this.repo
      .createQueryBuilder('dailyMetric')
      .select('SUM(dailyMetric.totalRevenue)', 'totalRevenue')
      .addSelect('SUM(dailyMetric.totalOrders)', 'totalOrders')
      .addSelect('SUM(dailyMetric.newCustomers)', 'newCustomers')
      .addSelect('AVG(dailyMetric.averageOrderValue)', 'averageOrderValue')
      .where('dailyMetric.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return {
      totalRevenue: Number(raw.totalRevenue ?? 0),

      averageOrderValue: Number(raw.averageOrderValue ?? 0),

      totalOrders: Number(raw.totalOrders ?? 0),

      newCustomers: Number(raw.newCustomers ?? 0),
    };
  }

  async getGrowth(
    currentStartDate: string,
    currentEndDate: string,
    previousStartDate: string,
    previousEndDate: string,
  ): Promise<DailyMetricGrowthDto> {
    const current = await this.getSummary(currentStartDate, currentEndDate);

    const previous = await this.getSummary(previousStartDate, previousEndDate);

    const calculateGrowth = (currentValue: number, previousValue: number): number => {
      if (previousValue <= 0) {
        return currentValue > 0 ? 100 : 0;
      }

      return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(2));
    };

    return {
      revenueGrowth: calculateGrowth(current.totalRevenue, previous.totalRevenue),

      averageOrderValueGrowth: calculateGrowth(
        current.averageOrderValue,
        previous.averageOrderValue,
      ),

      ordersGrowth: calculateGrowth(current.totalOrders, previous.totalOrders),

      newCustomersGrowth: calculateGrowth(current.newCustomers, previous.newCustomers),
    };
  }
}
