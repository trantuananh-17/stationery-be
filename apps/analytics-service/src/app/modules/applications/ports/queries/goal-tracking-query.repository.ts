import { GoalProgressDto } from '../dtos/goal-progress.dto';

export abstract class IGoalTrackingQueryRepository {
  abstract getProgress(bucketMonth: string): Promise<GoalProgressDto | null>;
}
