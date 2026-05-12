import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ISalesPerformanceQueryRepository } from '../../../applications/ports/queries/sales-performance-query.repository';
import { SalesPerformanceOrmEntity } from '../../entities/sales-performance.orm-entity';
import {
  SalesPerformanceChartDto,
  SalesPerformanceSummaryDto,
} from '../../../applications/ports/dtos/sales-performance.dto';

@Injectable()
export class TypeOrmSalesPerformanceQueryRepository implements ISalesPerformanceQueryRepository {
  constructor(
    @InjectRepository(SalesPerformanceOrmEntity)
    private readonly repo: Repository<SalesPerformanceOrmEntity>,
  ) {}

  async getSummary(startDate: string, endDate: string): Promise<SalesPerformanceSummaryDto> {
    const raw = await this.repo
      .createQueryBuilder('salesPerformance')
      .select('SUM(salesPerformance.revenue)', 'revenue')
      .addSelect('SUM(salesPerformance.orders)', 'orders')
      .addSelect('SUM(salesPerformance.estimatedProfit)', 'estimatedProfit')
      .where('salesPerformance.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return {
      totalRevenue: Number(raw.revenue ?? 0),
      totalOrders: Number(raw.orders ?? 0),
      totalProfit: Number(raw.estimatedProfit ?? 0),
      averageOrderValue:
        Number(raw.orders ?? 0) > 0 ? Number(raw.revenue ?? 0) / Number(raw.orders ?? 0) : 0,
    };
  }

  async getChart(startDate: string, endDate: string): Promise<SalesPerformanceChartDto[]> {
    const raws = await this.repo
      .createQueryBuilder('salesPerformance')
      .select('salesPerformance.bucketDate', 'date')
      .addSelect('salesPerformance.revenue', 'revenue')
      .addSelect('salesPerformance.orders', 'orders')
      .addSelect('salesPerformance.estimatedProfit', 'estimatedProfit')
      .where('salesPerformance.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('salesPerformance.bucketDate', 'ASC')
      .getRawMany();

    return raws.map((raw) => ({
      date: raw.date,

      revenue: Number(raw.revenue),

      orders: Number(raw.orders),

      estimatedProfit: Number(raw.estimatedProfit),
    }));
  }
}
