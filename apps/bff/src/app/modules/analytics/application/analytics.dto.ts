import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export interface DailyRangeRequestDto {
  startDate: string;
  endDate: string;
}

export interface TopProductsRequestDto {
  startDate: string;
  endDate: string;
  limit: number;
}

export interface RecentTransactionsRequestDto {
  limit: number;
}

export interface GoalProgressRequestDto {
  bucketMonth: string;
}

export interface DailySummaryResponseDto {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  newCustomers: number;
}

export interface DailyGrowthResponseDto {
  revenueGrowth: number;
  averageOrderValueGrowth: number;
  ordersGrowth: number;
  newCustomersGrowth: number;
}

export interface SalesSummaryResponseDto {
  totalRevenue: number;
  totalOrders: number;
  totalProfit: number;
  averageOrderValue: number;
}

export interface SalesChartItemDto {
  date: GrpcTimestamp;
  revenue: number;
  orders: number;
  estimatedProfit: number;
}

export interface SalesChartResponseDto {
  data: SalesChartItemDto[];
}

export interface TopProductDto {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface TopProductsResponseDto {
  data: TopProductDto[];
}

export interface CategoryRevenueDto {
  categoryId: string;
  categoryName: string;
  revenue: number;
}

export interface CategoryRevenueResponseDto {
  data: CategoryRevenueDto[];
}

export interface TransactionDto {
  orderId: string;
  customerName: string;
  totalAmount: string;
  totalItems: number;
  status: string;
  orderedAt: GrpcTimestamp;
}

export interface RecentTransactionsResponseDto {
  data: TransactionDto[];
}

export interface OrderStatusSummaryResponseDto {
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface GoalProgressResponseDto {
  revenueGoal: number;
  currentRevenue: number;
  revenueProgress: number;

  ordersGoal: number;
  currentOrders: number;
  ordersProgress: number;

  customersGoal: number;
  currentCustomers: number;
  customersProgress: number;
}
