import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IGoalTrackingQueryRepository } from '../../../applications/ports/queries/goal-tracking-query.repository';
import { GoalTrackingOrmEntity } from '../../entities/goal-tracking.orm-entity';
import { GoalProgressDto } from '../../../applications/ports/dtos/goal-progress.dto';

@Injectable()
export class TypeOrmGoalTrackingQueryRepository implements IGoalTrackingQueryRepository {
  constructor(
    @InjectRepository(GoalTrackingOrmEntity)
    private readonly repo: Repository<GoalTrackingOrmEntity>,
  ) {}

  async getProgress(bucketMonth: string): Promise<GoalProgressDto | null> {
    const entity = await this.repo.findOne({
      where: {
        bucketMonth,
      },
    });

    if (!entity) {
      return null;
    }

    return {
      revenueGoal: Number(entity.revenueGoal),

      currentRevenue: Number(entity.currentRevenue),

      revenueProgress:
        entity.revenueGoal > 0
          ? Math.min((Number(entity.currentRevenue) / Number(entity.revenueGoal)) * 100, 100)
          : 0,

      ordersGoal: entity.ordersGoal,

      currentOrders: entity.currentOrders,

      ordersProgress:
        entity.ordersGoal > 0 ? Math.min((entity.currentOrders / entity.ordersGoal) * 100, 100) : 0,

      customersGoal: entity.customersGoal,

      currentCustomers: entity.currentCustomers,

      customersProgress:
        entity.customersGoal > 0
          ? Math.min((entity.currentCustomers / entity.customersGoal) * 100, 100)
          : 0,
    };
  }
}
