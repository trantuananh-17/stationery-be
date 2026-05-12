import { GoalTracking } from '../../../domain/entities/goal-tracking.entity';

export abstract class IGoalTrackingCommandRepository {
  abstract findByMonth(bucketMonth: string): Promise<GoalTracking | null>;

  abstract save(goal: GoalTracking): Promise<void>;
}
