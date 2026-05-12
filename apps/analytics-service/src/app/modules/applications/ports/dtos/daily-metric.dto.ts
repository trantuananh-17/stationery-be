export class DailyMetricSummaryDto {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  newCustomers: number;
}

export class DailyMetricGrowthDto {
  revenueGrowth: number;
  averageOrderValueGrowth: number;
  ordersGrowth: number;
  newCustomersGrowth: number;
}
