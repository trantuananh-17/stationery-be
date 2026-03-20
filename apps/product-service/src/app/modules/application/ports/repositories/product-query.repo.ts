import { Product } from '../../../domain/entities/product.entity';
import { ProductOrderBy } from '../../../domain/enum/product-orderby.enum';
import { ProductReadModel } from '../../read-models/product.read-model';
import { QueryResult } from '@common/interfaces/common/pagination.interface';

export abstract class IProductQueryRepository {
  abstract findAll(filters: {
    keywords?: string[];
    category?: string;
    brand?: string;
    orderBy?: ProductOrderBy;
    page: number;
    limit: number;
  }): Promise<QueryResult<ProductReadModel>>;
  abstract findById(productId: string): Promise<Product | null>;
  abstract findMaxSlug(prefix: string): Promise<string>;
}
