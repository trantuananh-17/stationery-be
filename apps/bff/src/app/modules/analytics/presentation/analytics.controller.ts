import { Body, Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';

import {
  DailySummaryResponseDto,
  DailyGrowthResponseDto,
  SalesSummaryResponseDto,
  SalesChartResponseDto,
  TopProductsResponseDto,
  CategoryRevenueResponseDto,
  RecentTransactionsResponseDto,
  OrderStatusSummaryResponseDto,
  GoalProgressResponseDto,
} from '../application/analytics.dto';

import { AnalyticsPort } from '../application/analytics.port';
import { DailyRangeRequestDto } from './dtos/daily-range-request.dto';
import { TopProductsRequestDto } from './dtos/top-products-request.dto';
import { RecentTransactionsRequestDto } from './dtos/recent-transactions-request.dto';
import { GoalProgressRequestDto } from './dtos/goal-progress-request.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsPort: AnalyticsPort) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('daily-summary')
  @ApiOkResponse({
    type: ResponseDto<DailySummaryResponseDto>,
  })
  @ApiOperation({ summary: 'Get daily summary' })
  getDailySummary(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get daily summary: ${JSON.stringify(query)}`);
    return this.analyticsPort.getDailySummary(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('daily-growth')
  @ApiOkResponse({
    type: ResponseDto<DailyGrowthResponseDto>,
  })
  @ApiOperation({ summary: 'Get daily growth' })
  getDailyGrowth(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get daily growth: ${JSON.stringify(query)}`);
    return this.analyticsPort.getDailyGrowth(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('sales-summary')
  @ApiOkResponse({
    type: ResponseDto<SalesSummaryResponseDto>,
  })
  @ApiOperation({ summary: 'Get sales summary' })
  getSalesSummary(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get sales summary: ${JSON.stringify(query)}`);
    return this.analyticsPort.getSalesSummary(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('sales-chart')
  @ApiOkResponse({
    type: ResponseDto<SalesChartResponseDto>,
  })
  @ApiOperation({ summary: 'Get sales chart' })
  getSalesChart(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get sales chart: ${JSON.stringify(query)}`);
    return this.analyticsPort.getSalesChart(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('top-products')
  @ApiOkResponse({
    type: ResponseDto<TopProductsResponseDto>,
  })
  @ApiOperation({ summary: 'Get top products' })
  getTopProducts(@Query() query: TopProductsRequestDto) {
    Logger.log(`Get top products: ${JSON.stringify(query)}`);
    return this.analyticsPort.getTopProducts(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('category-revenue')
  @ApiOkResponse({
    type: ResponseDto<CategoryRevenueResponseDto>,
  })
  @ApiOperation({ summary: 'Get category revenue' })
  getCategoryRevenue(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get category revenue: ${JSON.stringify(query)}`);
    return this.analyticsPort.getCategoryRevenue(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('recent-transactions')
  @ApiOkResponse({
    type: ResponseDto<RecentTransactionsResponseDto>,
  })
  @ApiOperation({ summary: 'Get recent transactions' })
  getRecentTransactions(@Query() query: RecentTransactionsRequestDto) {
    Logger.log(`Get recent transactions: ${JSON.stringify(query)}`);
    return this.analyticsPort.getRecentTransactions(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('order-status-summary')
  @ApiOkResponse({
    type: ResponseDto<OrderStatusSummaryResponseDto>,
  })
  @ApiOperation({ summary: 'Get order status summary' })
  getOrderStatusSummary(@Query() query: DailyRangeRequestDto) {
    Logger.log(`Get order status summary: ${JSON.stringify(query)}`);
    return this.analyticsPort.getOrderStatusSummary(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('goal-progress')
  @ApiOkResponse({
    type: ResponseDto<GoalProgressResponseDto>,
  })
  @ApiOperation({ summary: 'Get goal progress' })
  getGoalProgress(@Query() query: GoalProgressRequestDto) {
    Logger.log(`Get goal progress: ${JSON.stringify(query)}`);
    return this.analyticsPort.getGoalProgress(query);
  }
}
