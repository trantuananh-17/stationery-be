import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyMetricOrmEntity } from './entities/daily-metric.orm-entity';
import { SalesPerformanceOrmEntity } from './entities/sales-performance.orm-entity';
import { ProductPerformanceOrmEntity } from './entities/product-performance.orm-entity';
import { CategoryPerformanceOrmEntity } from './entities/category-performance.orm-entity';
import { OrderStatusMetricOrmEntity } from './entities/order-status-metric.orm-entity';
import { RecentTransactionOrmEntity } from './entities/recent-transaction.orm-entity';
import { GoalTrackingOrmEntity } from './entities/goal-tracking.orm-entity';
import { IDailyMetricCommandRepository } from '../applications/ports/commands/daily-metric-command.repository';
import { TypeOrmDailyMetricCommandRepository } from './repositories/commands/typeorm-daily-metric-command.repository';
import { ISalesPerformanceCommandRepository } from '../applications/ports/commands/sales-performance-command.repository';
import { TypeOrmSalesPerformanceCommandRepository } from './repositories/commands/typeorm-sales-performance-command.repository';
import { IProductPerformanceCommandRepository } from '../applications/ports/commands/product-performance-command.repository';
import { TypeOrmProductPerformanceCommandRepository } from './repositories/commands/typeorm-product-performance-command.repository';
import { ICategoryPerformanceCommandRepository } from '../applications/ports/commands/category-performance-command.repository';
import { TypeOrmCategoryPerformanceCommandRepository } from './repositories/commands/typeorm-category-performance-command.repository';
import { IOrderStatusMetricCommandRepository } from '../applications/ports/commands/order-status-metric-command.repository';
import { TypeOrmOrderStatusMetricCommandRepository } from './repositories/commands/typeorm-order-status-metric-command.repository';
import { IRecentTransactionCommandRepository } from '../applications/ports/commands/recent-transaction-command.repository';
import { TypeOrmRecentTransactionCommandRepository } from './repositories/commands/typeorm-recent-transaction-command.repository';
import { IGoalTrackingCommandRepository } from '../applications/ports/commands/goal-tracking-command.repository';
import { TypeOrmGoalTrackingCommandRepository } from './repositories/commands/typeorm-goal-tracking-command.repository';
import { IDailyMetricQueryRepository } from '../applications/ports/queries/daily-metric-query.repository';
import { TypeOrmDailyMetricQueryRepository } from './repositories/queries/typeorm-daily-metric-query.repository';
import { ISalesPerformanceQueryRepository } from '../applications/ports/queries/sales-performance-query.repository';
import { TypeOrmSalesPerformanceQueryRepository } from './repositories/queries/typeorm-sales-performance-query.repository';
import { IProductPerformanceQueryRepository } from '../applications/ports/queries/product-performance-query.repository';
import { TypeOrmProductPerformanceQueryRepository } from './repositories/queries/typeorm-product-performance-query.repository';
import { ICategoryPerformanceQueryRepository } from '../applications/ports/queries/category-performance-query.repository';
import { TypeOrmCategoryPerformanceQueryRepository } from './repositories/queries/typeorm-category-performance-query.repository';
import { IOrderStatusMetricQueryRepository } from '../applications/ports/queries/order-status-metric-query.repository';
import { TypeOrmOrderStatusMetricQueryRepository } from './repositories/queries/typeorm-order-status-metric-query.repository';
import { IRecentTransactionQueryRepository } from '../applications/ports/queries/recent-transaction-query.repository';
import { TypeOrmRecentTransactionQueryRepository } from './repositories/queries/typeorm-recent-transaction-query.repository';
import { IGoalTrackingQueryRepository } from '../applications/ports/queries/goal-tracking-query.repository';
import { TypeOrmGoalTrackingQueryRepository } from './repositories/queries/typeorm-goal-tracking-query.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyMetricOrmEntity,
      SalesPerformanceOrmEntity,
      ProductPerformanceOrmEntity,
      CategoryPerformanceOrmEntity,
      OrderStatusMetricOrmEntity,
      RecentTransactionOrmEntity,
      GoalTrackingOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: IDailyMetricCommandRepository,
      useClass: TypeOrmDailyMetricCommandRepository,
    },
    {
      provide: ISalesPerformanceCommandRepository,
      useClass: TypeOrmSalesPerformanceCommandRepository,
    },
    {
      provide: IProductPerformanceCommandRepository,
      useClass: TypeOrmProductPerformanceCommandRepository,
    },
    {
      provide: ICategoryPerformanceCommandRepository,
      useClass: TypeOrmCategoryPerformanceCommandRepository,
    },
    {
      provide: IOrderStatusMetricCommandRepository,
      useClass: TypeOrmOrderStatusMetricCommandRepository,
    },
    {
      provide: IRecentTransactionCommandRepository,
      useClass: TypeOrmRecentTransactionCommandRepository,
    },
    {
      provide: IGoalTrackingCommandRepository,
      useClass: TypeOrmGoalTrackingCommandRepository,
    },
    {
      provide: IDailyMetricQueryRepository,
      useClass: TypeOrmDailyMetricQueryRepository,
    },
    {
      provide: ISalesPerformanceQueryRepository,
      useClass: TypeOrmSalesPerformanceQueryRepository,
    },
    {
      provide: IProductPerformanceQueryRepository,
      useClass: TypeOrmProductPerformanceQueryRepository,
    },
    {
      provide: ICategoryPerformanceQueryRepository,
      useClass: TypeOrmCategoryPerformanceQueryRepository,
    },
    {
      provide: IOrderStatusMetricQueryRepository,
      useClass: TypeOrmOrderStatusMetricQueryRepository,
    },
    {
      provide: IRecentTransactionQueryRepository,
      useClass: TypeOrmRecentTransactionQueryRepository,
    },
    {
      provide: IGoalTrackingQueryRepository,
      useClass: TypeOrmGoalTrackingQueryRepository,
    },
  ],
  exports: [
    IDailyMetricCommandRepository,
    ISalesPerformanceCommandRepository,
    IProductPerformanceCommandRepository,
    ICategoryPerformanceCommandRepository,
    IOrderStatusMetricCommandRepository,
    IRecentTransactionCommandRepository,
    IGoalTrackingCommandRepository,
    IDailyMetricQueryRepository,
    ISalesPerformanceQueryRepository,
    IProductPerformanceQueryRepository,
    ICategoryPerformanceQueryRepository,
    IOrderStatusMetricQueryRepository,
    IRecentTransactionQueryRepository,
    IGoalTrackingQueryRepository,
  ],
})
export class AnalyticsInfraModule {}
