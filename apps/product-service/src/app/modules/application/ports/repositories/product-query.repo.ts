import { Product } from '../../../domain/entities/product.entity';
import { AdminProductOrderBy, ProductOrderBy } from '../../../domain/enum/product-orderby.enum';
import { ProductStatus } from '../../../domain/enum/product-status.enum';
import { GetProductAiDto } from '../../queries/get-product-ai/get-product-ai.dto';
import { ProductAiReadModel } from '../../read-models/product-ai.read-model';
import { ProductInfoReadModel } from '../../read-models/product-info.read-model';
import { ProductItemReadModel } from '../../read-models/product-item.read.model';
import { ProductReadModel } from '../../read-models/product.read-model';
import { QueryResult } from '@common/interfaces/common/pagination.interface';

export abstract class IProductQueryRepository {
  abstract findAll(filters: {
    keywords: string[];
    status?: ProductStatus;
    orderBy?: AdminProductOrderBy;
    page: number;
    limit: number;
  }): Promise<QueryResult<ProductReadModel>>;
  abstract findAllActive(filters: {
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
  abstract findProductItemBase(variantId: string): Promise<ProductItemReadModel | null>;

  abstract findProductsForAiAdvisor(filters: GetProductAiDto): Promise<ProductAiReadModel[]>;
}
