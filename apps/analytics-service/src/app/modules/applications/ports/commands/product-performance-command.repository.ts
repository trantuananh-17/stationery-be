import { ProductPerformance } from '../../../domain/entities/product-performance.entity';

export abstract class IProductPerformanceCommandRepository {
  abstract findByProductAndDate(
    productId: string,
    date: string,
  ): Promise<ProductPerformance | null>;

  abstract save(performance: ProductPerformance): Promise<void>;
}
