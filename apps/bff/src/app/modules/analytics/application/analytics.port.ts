import {
  CategoryRevenueResponseDto,
  DailyGrowthResponseDto,
  DailyRangeRequestDto,
  DailySummaryResponseDto,
  GoalProgressRequestDto,
  GoalProgressResponseDto,
  OrderStatusSummaryResponseDto,
  RecentTransactionsRequestDto,
  RecentTransactionsResponseDto,
  SalesChartResponseDto,
  SalesSummaryResponseDto,
  TopProductsRequestDto,
  TopProductsResponseDto,
} from './analytics.dto';

export abstract class AnalyticsPort {
  abstract getDailySummary(data: DailyRangeRequestDto): Promise<DailySummaryResponseDto>;

  abstract getDailyGrowth(data: DailyRangeRequestDto): Promise<DailyGrowthResponseDto>;

  abstract getSalesSummary(data: DailyRangeRequestDto): Promise<SalesSummaryResponseDto>;

  abstract getSalesChart(data: DailyRangeRequestDto): Promise<SalesChartResponseDto>;

  abstract getTopProducts(data: TopProductsRequestDto): Promise<TopProductsResponseDto>;

  abstract getCategoryRevenue(data: DailyRangeRequestDto): Promise<CategoryRevenueResponseDto>;

  abstract getRecentTransactions(
    data: RecentTransactionsRequestDto,
  ): Promise<RecentTransactionsResponseDto>;

  abstract getOrderStatusSummary(
    data: DailyRangeRequestDto,
  ): Promise<OrderStatusSummaryResponseDto>;

  abstract getGoalProgress(data: GoalProgressRequestDto): Promise<GoalProgressResponseDto>;
}
