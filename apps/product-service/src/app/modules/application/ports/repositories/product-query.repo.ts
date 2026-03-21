import { Product } from '../../../domain/entities/product.entity';
import { ProductOrderBy } from '../../../domain/enum/product-orderby.enum';
import { ProductInfoReadModel } from '../../read-models/product-info.read-model';
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
  abstract findProductInfo(productId?: string, slug?: string): Promise<ProductInfoReadModel | null>;
  abstract findFeaturedProducts(
    page: number,
    limit: number,
  ): Promise<QueryResult<ProductReadModel>>;
  abstract findRelatedProducts(params: {
    productId: string;
    categoryId: string;
    brandId: string;
    limit: number;
  }): Promise<ProductReadModel[]>;
  abstract findRelatedBaseInfoById(
    id: string,
  ): Promise<{ id: string; categoryId: string; brandId: string } | null>;
}
