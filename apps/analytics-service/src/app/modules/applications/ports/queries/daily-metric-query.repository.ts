import { DailyMetricGrowthDto, DailyMetricSummaryDto } from '../dtos/daily-metric.dto';

export abstract class IDailyMetricQueryRepository {
  abstract getSummary(startDate: string, endDate: string): Promise<DailyMetricSummaryDto>;

  abstract getGrowth(
    currentStartDate: string,
    currentEndDate: string,
    previousStartDate: string,
    previousEndDate: string,
  ): Promise<DailyMetricGrowthDto>;
}
