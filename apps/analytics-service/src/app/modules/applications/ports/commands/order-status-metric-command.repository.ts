import { OrderStatusMetric } from '../../../domain/entities/order-status-metric.entity';

export abstract class IOrderStatusMetricCommandRepository {
  abstract findByDate(date: string): Promise<OrderStatusMetric | null>;

  abstract save(metric: OrderStatusMetric): Promise<void>;
}
