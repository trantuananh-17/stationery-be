import { Observable } from 'rxjs';
import {
  DailyRangeRequestDto,
  DailySummaryResponseDto,
  DailyGrowthResponseDto,
  SalesSummaryResponseDto,
  SalesChartResponseDto,
  TopProductsRequestDto,
  TopProductsResponseDto,
  CategoryRevenueResponseDto,
  RecentTransactionsRequestDto,
  RecentTransactionsResponseDto,
  OrderStatusSummaryResponseDto,
  GoalProgressRequestDto,
  GoalProgressResponseDto,
} from '../application/analytics.dto';

export interface IAnalyticsGrpcService {
  getDailySummary(data: DailyRangeRequestDto): Observable<DailySummaryResponseDto>;

  getDailyGrowth(data: DailyRangeRequestDto): Observable<DailyGrowthResponseDto>;

  getSalesSummary(data: DailyRangeRequestDto): Observable<SalesSummaryResponseDto>;

  getSalesChart(data: DailyRangeRequestDto): Observable<SalesChartResponseDto>;

  getTopProducts(data: TopProductsRequestDto): Observable<TopProductsResponseDto>;

  getCategoryRevenue(data: DailyRangeRequestDto): Observable<CategoryRevenueResponseDto>;

  getRecentTransactions(
    data: RecentTransactionsRequestDto,
  ): Observable<RecentTransactionsResponseDto>;

  getOrderStatusSummary(data: DailyRangeRequestDto): Observable<OrderStatusSummaryResponseDto>;

  getGoalProgress(data: GoalProgressRequestDto): Observable<GoalProgressResponseDto>;
}
