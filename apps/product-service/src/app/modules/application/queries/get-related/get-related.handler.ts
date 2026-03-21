import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRelatedQuery } from './get-related.query';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { ProductReadModel } from '../../read-models/product.read-model';
import { ProductNotFoundError } from '../../../domain/errors/product.error';

@QueryHandler(GetRelatedQuery)
export class GetRelatedHandler implements IQueryHandler<GetRelatedQuery> {
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetRelatedQuery): Promise<ProductReadModel[]> {
    const { productId, limit } = query;

    const productBaseInfo = await this.productRepo.findRelatedBaseInfoById(productId);

    if (!productBaseInfo) {
      throw new ProductNotFoundError();
    }

    return await this.productRepo.findRelatedProducts({
      productId,
      categoryId: productBaseInfo.categoryId,
      brandId: productBaseInfo.brandId,
      limit,
    });
  }
}
