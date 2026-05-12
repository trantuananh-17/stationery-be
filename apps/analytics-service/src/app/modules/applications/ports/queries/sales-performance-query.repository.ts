import {
  SalesPerformanceChartDto,
  SalesPerformanceSummaryDto,
} from '../dtos/sales-performance.dto';

export abstract class ISalesPerformanceQueryRepository {
  abstract getChart(startDate: string, endDate: string): Promise<SalesPerformanceChartDto[]>;

  abstract getSummary(startDate: string, endDate: string): Promise<SalesPerformanceSummaryDto>;
}
