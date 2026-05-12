export class SalesPerformanceChartDto {
  date: string;

  revenue: number;

  orders: number;

  estimatedProfit: number;
}
export class SalesPerformanceSummaryDto {
  totalRevenue: number;

  totalOrders: number;

  totalProfit: number;

  averageOrderValue: number;
}
