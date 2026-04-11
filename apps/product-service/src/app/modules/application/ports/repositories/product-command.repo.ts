import { Product } from '../../../domain/entities/product.entity';

export abstract class IProductCommandRepository {
  abstract save(product: Product): Promise<void>;
  abstract update(product: Product): Promise<void>;
  abstract findById(productId: string): Promise<Product | null>;
  abstract findMaxSlug(prefix: string): Promise<string | null>;
}
