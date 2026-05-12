import { Controller, Get, Query } from '@nestjs/common';

import { QueryBus } from '@nestjs/cqrs';

import { GetDailyMetricGrowthQuery } from '../../applications/queries/get-daily-metric-growth/get-daily-metric-growth.query';
import { GetDailyMetricSummaryQuery } from '../../applications/queries/get-daily-metric-summary/get-daily-metric-summary.query';
import { GetSalesPerformanceSummaryQuery } from '../../applications/queries/get-sales-performance-summary/get-sales-performance-summary.query';
import { GetSalesPerformanceChartQuery } from '../../applications/queries/get-sales-performance-chart/get-sales-performance-chart.query';
import { GetTopProductsQuery } from '../../applications/queries/get-top-products/get-top-products.query';
import { GetCategoryRevenueQuery } from '../../applications/queries/get-category-revenue/get-category-revenue.query';
import { GetRecentTransactionsQuery } from '../../applications/queries/get-recent-transactions/get-recent-transactions.query';
import { GetOrderStatusSummaryQuery } from '../../applications/queries/get-order-status-summary/get-order-status-summary.query';
import { GetGoalProgressQuery } from '../../applications/queries/get-goal-progress/get-goal-progress.query';
import { AnalyticsRangeDto } from './dtos/analytics-range.dto';
import { TopProductsDto } from './dtos/top-products.dto';
import { GoalProgressDto } from './dtos/goal-progress.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('daily-summary')
  async getDailySummary(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    return this.queryBus.execute(new GetDailyMetricSummaryQuery(query.startDate, query.endDate));
  }

  @Get('daily-growth')
  async getDailyGrowth(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    const currentStart = new Date(query.startDate);

    const currentEnd = new Date(query.endDate);

    const diff = currentEnd.getTime() - currentStart.getTime();

    const previousEnd = new Date(currentStart.getTime() - 1);

    const previousStart = new Date(previousEnd.getTime() - diff);

    return this.queryBus.execute(
      new GetDailyMetricGrowthQuery(
        query.startDate,
        query.endDate,

        previousStart.toISOString().split('T')[0],

        previousEnd.toISOString().split('T')[0],
      ),
    );
  }

  @Get('sales-summary')
  async getSalesSummary(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    return this.queryBus.execute(
      new GetSalesPerformanceSummaryQuery(query.startDate, query.endDate),
    );
  }

  @Get('sales-chart')
  async getSalesChart(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    return this.queryBus.execute(new GetSalesPerformanceChartQuery(query.startDate, query.endDate));
  }

  @Get('top-products')
  async getTopProducts(
    @Query()
    query: TopProductsDto,
  ) {
    return this.queryBus.execute(
      new GetTopProductsQuery(
        query.startDate,
        query.endDate,

        Number(query.limit ?? 5),
      ),
    );
  }

  @Get('category-revenue')
  async getCategoryRevenue(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    return this.queryBus.execute(new GetCategoryRevenueQuery(query.startDate, query.endDate));
  }

  @Get('recent-transactions')
  async getRecentTransactions() {
    return this.queryBus.execute(new GetRecentTransactionsQuery(10));
  }

  @Get('order-status-summary')
  async getOrderStatusSummary(
    @Query()
    query: AnalyticsRangeDto,
  ) {
    return this.queryBus.execute(new GetOrderStatusSummaryQuery(query.startDate, query.endDate));
  }

  @Get('goal-progress')
  async getGoalProgress(
    @Query()
    query: GoalProgressDto,
  ) {
    return this.queryBus.execute(new GetGoalProgressQuery(query.bucketMonth));
  }
}
