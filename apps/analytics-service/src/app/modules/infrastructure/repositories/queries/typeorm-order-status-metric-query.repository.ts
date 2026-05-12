import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IOrderStatusMetricQueryRepository } from '../../../applications/ports/queries/order-status-metric-query.repository';
import { OrderStatusMetricOrmEntity } from '../../entities/order-status-metric.orm-entity';
import { OrderStatusSummaryDto } from '../../../applications/ports/dtos/order-status-metric.dto';

@Injectable()
export class TypeOrmOrderStatusMetricQueryRepository implements IOrderStatusMetricQueryRepository {
  constructor(
    @InjectRepository(OrderStatusMetricOrmEntity)
    private readonly repo: Repository<OrderStatusMetricOrmEntity>,
  ) {}

  async getSummary(startDate: string, endDate: string): Promise<OrderStatusSummaryDto> {
    const raw = await this.repo
      .createQueryBuilder('metric')
      .select('SUM(metric.pendingOrders)', 'pendingOrders')
      .addSelect('SUM(metric.processingOrders)', 'processingOrders')
      .addSelect('SUM(metric.shippedOrders)', 'shippedOrders')
      .addSelect('SUM(metric.deliveredOrders)', 'deliveredOrders')
      .addSelect('SUM(metric.cancelledOrders)', 'cancelledOrders')
      .where('metric.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return {
      pendingOrders: Number(raw.pendingOrders ?? 0),

      processingOrders: Number(raw.processingOrders ?? 0),

      shippedOrders: Number(raw.shippedOrders ?? 0),

      deliveredOrders: Number(raw.deliveredOrders ?? 0),

      cancelledOrders: Number(raw.cancelledOrders ?? 0),
    };
  }
}
