import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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
import { IAnalyticsGrpcService } from './analytics.interface';
import { AnalyticsPort } from '../application/analytics.port';

@Injectable()
export class AnalyticsGrpcAdapter implements AnalyticsPort, OnModuleInit {
  private analyticsService: IAnalyticsGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.ANALYTICS_SERVICE)
    private readonly analyticsClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.analyticsService =
      this.analyticsClient.getService<IAnalyticsGrpcService>('AnalyticsService');
  }

  getDailySummary(data: DailyRangeRequestDto): Promise<DailySummaryResponseDto> {
    return firstValueFrom(this.analyticsService.getDailySummary(data));
  }

  getDailyGrowth(data: DailyRangeRequestDto): Promise<DailyGrowthResponseDto> {
    return firstValueFrom(this.analyticsService.getDailyGrowth(data));
  }

  getSalesSummary(data: DailyRangeRequestDto): Promise<SalesSummaryResponseDto> {
    return firstValueFrom(this.analyticsService.getSalesSummary(data));
  }

  getSalesChart(data: DailyRangeRequestDto): Promise<SalesChartResponseDto> {
    return firstValueFrom(this.analyticsService.getSalesChart(data));
  }

  getTopProducts(data: TopProductsRequestDto): Promise<TopProductsResponseDto> {
    return firstValueFrom(this.analyticsService.getTopProducts(data));
  }

  getCategoryRevenue(data: DailyRangeRequestDto): Promise<CategoryRevenueResponseDto> {
    return firstValueFrom(this.analyticsService.getCategoryRevenue(data));
  }

  getRecentTransactions(
    data: RecentTransactionsRequestDto,
  ): Promise<RecentTransactionsResponseDto> {
    return firstValueFrom(this.analyticsService.getRecentTransactions(data));
  }

  getOrderStatusSummary(data: DailyRangeRequestDto): Promise<OrderStatusSummaryResponseDto> {
    return firstValueFrom(this.analyticsService.getOrderStatusSummary(data));
  }

  getGoalProgress(data: GoalProgressRequestDto): Promise<GoalProgressResponseDto> {
    return firstValueFrom(this.analyticsService.getGoalProgress(data));
  }
}
