import { DailyMetric } from '../../../domain/entities/daily-metric.entity';

export abstract class IDailyMetricCommandRepository {
  abstract findByDate(date: string): Promise<DailyMetric | null>;

  abstract save(metric: DailyMetric): Promise<void>;
}
