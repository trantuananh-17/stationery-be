import { SalesPerformance } from '../../../domain/entities/sales-performance.entity';

export abstract class ISalesPerformanceCommandRepository {
  abstract findByDate(date: string): Promise<SalesPerformance | null>;

  abstract save(performance: SalesPerformance): Promise<void>;
}
