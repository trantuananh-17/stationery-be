import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IGoalTrackingCommandRepository } from '../../../applications/ports/commands/goal-tracking-command.repository';
import { GoalTrackingOrmEntity } from '../../entities/goal-tracking.orm-entity';
import { GoalTracking } from '../../../domain/entities/goal-tracking.entity';

@Injectable()
export class TypeOrmGoalTrackingCommandRepository implements IGoalTrackingCommandRepository {
  constructor(
    @InjectRepository(GoalTrackingOrmEntity)
    private readonly repo: Repository<GoalTrackingOrmEntity>,
  ) {}

  async findByMonth(bucketMonth: string): Promise<GoalTracking | null> {
    const entity = await this.repo.findOne({
      where: {
        bucketMonth,
      },
    });

    if (!entity) {
      return null;
    }

    return GoalTracking.restore({
      id: entity.id,

      bucketMonth: entity.bucketMonth,

      revenueGoal: Number(entity.revenueGoal),

      currentRevenue: Number(entity.currentRevenue),

      ordersGoal: entity.ordersGoal,

      currentOrders: entity.currentOrders,

      customersGoal: entity.customersGoal,

      currentCustomers: entity.currentCustomers,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    });
  }

  async save(goal: GoalTracking): Promise<void> {
    await this.repo.save({
      id: goal.id,

      bucketMonth: goal.bucketMonth,

      revenueGoal: goal.revenueGoal,

      currentRevenue: goal.currentRevenue,

      ordersGoal: goal.ordersGoal,

      currentOrders: goal.currentOrders,

      customersGoal: goal.customersGoal,

      currentCustomers: goal.currentCustomers,

      createdAt: goal.createdAt,

      updatedAt: goal.updatedAt,
    });
  }
}
