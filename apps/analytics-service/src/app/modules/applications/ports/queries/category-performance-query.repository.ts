import { CategoryPerformanceChartDto, CategoryRevenueDto } from '../dtos/category-performance.dto';

export abstract class ICategoryPerformanceQueryRepository {
  abstract getRevenueByCategory(startDate: string, endDate: string): Promise<CategoryRevenueDto[]>;
}
