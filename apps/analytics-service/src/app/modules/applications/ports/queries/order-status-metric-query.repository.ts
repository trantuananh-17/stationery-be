import { OrderStatusSummaryDto } from '../dtos/order-status-metric.dto';

export abstract class IOrderStatusMetricQueryRepository {
  abstract getSummary(startDate: string, endDate: string): Promise<OrderStatusSummaryDto>;
}
