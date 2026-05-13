import { Controller } from '@nestjs/common';

import { QueryBus } from '@nestjs/cqrs';

import { ApiTags } from '@nestjs/swagger';

import { GetDailyMetricGrowthQuery } from '../../applications/queries/get-daily-metric-growth/get-daily-metric-growth.query';

import { GetDailyMetricSummaryQuery } from '../../applications/queries/get-daily-metric-summary/get-daily-metric-summary.query';

import { GetSalesPerformanceSummaryQuery } from '../../applications/queries/get-sales-performance-summary/get-sales-performance-summary.query';

import { GetSalesPerformanceChartQuery } from '../../applications/queries/get-sales-performance-chart/get-sales-performance-chart.query';

import { GetTopProductsQuery } from '../../applications/queries/get-top-products/get-top-products.query';

import { GetCategoryRevenueQuery } from '../../applications/queries/get-category-revenue/get-category-revenue.query';

import { GetRecentTransactionsQuery } from '../../applications/queries/get-recent-transactions/get-recent-transactions.query';

import { GetOrderStatusSummaryQuery } from '../../applications/queries/get-order-status-summary/get-order-status-summary.query';

import { GetGoalProgressQuery } from '../../applications/queries/get-goal-progress/get-goal-progress.query';

import { GrpcMethod } from '@nestjs/microservices';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod('AnalyticsService', 'GetDailySummary')
  grpcGetDailySummary(data: { startDate: string; endDate: string }) {
    return this.queryBus.execute(new GetDailyMetricSummaryQuery(data.startDate, data.endDate));
  }

  @GrpcMethod('AnalyticsService', 'GetDailyGrowth')
  grpcGetDailyGrowth(data: { startDate: string; endDate: string }) {
    const currentStart = new Date(data.startDate);
    const currentEnd = new Date(data.endDate);
    const diff = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - diff);

    return this.queryBus.execute(
      new GetDailyMetricGrowthQuery(
        data.startDate,
        data.endDate,
        previousStart.toISOString().split('T')[0],
        previousEnd.toISOString().split('T')[0],
      ),
    );
  }

  @GrpcMethod('AnalyticsService', 'GetSalesSummary')
  grpcGetSalesSummary(data: { startDate: string; endDate: string }) {
    return this.queryBus.execute(new GetSalesPerformanceSummaryQuery(data.startDate, data.endDate));
  }

  @GrpcMethod('AnalyticsService', 'GetSalesChart')
  grpcGetSalesChart(data: { startDate: string; endDate: string }) {
    return this.queryBus.execute(new GetSalesPerformanceChartQuery(data.startDate, data.endDate));
  }

  @GrpcMethod('AnalyticsService', 'GetTopProducts')
  grpcGetTopProducts(data: { startDate: string; endDate: string; limit?: number }) {
    return this.queryBus.execute(
      new GetTopProductsQuery(data.startDate, data.endDate, data.limit ?? 5),
    );
  }

  @GrpcMethod('AnalyticsService', 'GetCategoryRevenue')
  grpcGetCategoryRevenue(data: { startDate: string; endDate: string }) {
    return this.queryBus.execute(new GetCategoryRevenueQuery(data.startDate, data.endDate));
  }

  @GrpcMethod('AnalyticsService', 'GetRecentTransactions')
  grpcGetRecentTransactions(data: { limit: number }) {
    return this.queryBus.execute(new GetRecentTransactionsQuery(data.limit));
  }

  @GrpcMethod('AnalyticsService', 'GetOrderStatusSummary')
  grpcGetOrderStatusSummary(data: { startDate: string; endDate: string }) {
    return this.queryBus.execute(new GetOrderStatusSummaryQuery(data.startDate, data.endDate));
  }

  @GrpcMethod('AnalyticsService', 'GetGoalProgress')
  grpcGetGoalProgress(data: { bucketMonth: string }) {
    return this.queryBus.execute(new GetGoalProgressQuery(data.bucketMonth));
  }
}
