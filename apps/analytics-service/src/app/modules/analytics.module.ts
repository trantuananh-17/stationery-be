import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';

import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { AnalyticsController } from './presentation/http/analytics.controller';
import { CustomerConsumer } from './presentation/kafka/customer.consumer';
import { OrderConsumer } from './presentation/kafka/order.consumer';
import { DailyMetricHandler } from './applications/commands/daily-metric/daily-metric.handler';
import { SalesPerformanceHandler } from './applications/commands/sales-performance/sales-performance.handler';
import { ProductPerformanceHandler } from './applications/commands/product-performance/product-performance.handler';
import { CategoryPerformanceHandler } from './applications/commands/category-performance/category-performance.handler';
import { OrderStatusMetricHandler } from './applications/commands/order-status-metric/order-status-metric.handler';
import { RecentTransactionHandler } from './applications/commands/recent-transaction/recent-transaction.handler';
import { GoalTrackingHandler } from './applications/commands/goal-tracking/goal-tracking.handler';
import { GetDailyMetricSummaryHandler } from './applications/queries/get-daily-metric-summary/get-daily-metric-summary.handler';
import { GetDailyMetricGrowthHandler } from './applications/queries/get-daily-metric-growth/get-daily-metric-growth.handler';
import { GetSalesPerformanceSummaryHandler } from './applications/queries/get-sales-performance-summary/get-sales-performance-summary.handler';
import { GetSalesPerformanceChartHandler } from './applications/queries/get-sales-performance-chart/get-sales-performance-chart.handler';
import { GetTopProductsHandler } from './applications/queries/get-top-products/get-top-products.handler';
import { GetCategoryRevenueHandler } from './applications/queries/get-category-revenue/get-category-revenue.handler';
import { GetRecentTransactionsHandler } from './applications/queries/get-recent-transactions/get-recent-transactions.handler';
import { GetOrderStatusSummaryHandler } from './applications/queries/get-order-status-summary/get-order-status-summary.handler';
import { GetGoalProgressHandler } from './applications/queries/get-goal-progress/get-goal-progress.handler';
import { AnalyticsInfraModule } from './infrastructure/analytics-infras.module';

@Module({
  imports: [CqrsModule, TypeOrmProvider, AnalyticsInfraModule],

  controllers: [AnalyticsController, CustomerConsumer, OrderConsumer],

  providers: [
    DailyMetricHandler,
    SalesPerformanceHandler,
    ProductPerformanceHandler,
    CategoryPerformanceHandler,
    OrderStatusMetricHandler,
    RecentTransactionHandler,
    GoalTrackingHandler,
    GetDailyMetricSummaryHandler,
    GetDailyMetricGrowthHandler,
    GetSalesPerformanceSummaryHandler,
    GetSalesPerformanceChartHandler,
    GetTopProductsHandler,
    GetCategoryRevenueHandler,
    GetRecentTransactionsHandler,
    GetOrderStatusSummaryHandler,
    GetGoalProgressHandler,
  ],
})
export class AnalyticsModule {}
