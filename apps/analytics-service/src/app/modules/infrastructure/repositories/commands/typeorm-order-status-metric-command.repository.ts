import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IOrderStatusMetricCommandRepository } from '../../../applications/ports/commands/order-status-metric-command.repository';
import { OrderStatusMetricOrmEntity } from '../../entities/order-status-metric.orm-entity';
import { OrderStatusMetric } from '../../../domain/entities/order-status-metric.entity';

@Injectable()
export class TypeOrmOrderStatusMetricCommandRepository
  implements IOrderStatusMetricCommandRepository
{
  constructor(
    @InjectRepository(OrderStatusMetricOrmEntity)
    private readonly repo: Repository<OrderStatusMetricOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<OrderStatusMetric | null> {
    const entity = await this.repo.findOne({
      where: {
        bucketDate: date,
      },
    });

    if (!entity) {
      return null;
    }

    return OrderStatusMetric.restore({
      id: entity.id,

      bucketDate: entity.bucketDate,

      pendingOrders: entity.pendingOrders,

      processingOrders: entity.processingOrders,

      shippedOrders: entity.shippedOrders,

      deliveredOrders: entity.deliveredOrders,

      cancelledOrders: entity.cancelledOrders,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(metric: OrderStatusMetric): Promise<void> {
    await this.repo.save({
      id: metric.id,

      bucketDate: metric.bucketDate,

      pendingOrders: metric.pendingOrders,

      processingOrders: metric.processingOrders,

      shippedOrders: metric.shippedOrders,

      deliveredOrders: metric.deliveredOrders,

      cancelledOrders: metric.cancelledOrders,

      createdAt: metric.createdAt,

      updatedAt: metric.updatedAt,
    });
  }
}
