import { Product } from '../../domain/entities/product.entity';

export abstract class IProductCommandRepository {
  abstract create(product: Product): Promise<void>;
  abstract update(): Promise<void>;
  abstract delete(): Promise<void>;
}
