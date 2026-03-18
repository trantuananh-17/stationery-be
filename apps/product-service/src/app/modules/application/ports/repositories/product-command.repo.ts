import { Product } from '../../../domain/entities/product.entity';

export abstract class IProductCommandRepository {
  abstract save(product: Product): Promise<void>;
}
