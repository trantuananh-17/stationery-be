import { Product } from '../../domain/entities/product.entity';

export abstract class IProductQueryRepository {
  abstract getAll(page: number, limit: number): Promise<Product[]>;
  abstract getById(): Promise<Product | null>;
}
