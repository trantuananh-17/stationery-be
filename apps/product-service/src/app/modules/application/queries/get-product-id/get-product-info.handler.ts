import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { ProductInfoReadModel } from '../../read-models/product-info.read-model';
import { GetProductInfoQuery } from './get-product-info.query';
import { ProductNotFoundError } from '../../../domain/errors/product.error';

@QueryHandler(GetProductInfoQuery)
export class GetProductInfoHandler implements IQueryHandler<GetProductInfoQuery> {
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetProductInfoQuery): Promise<ProductInfoReadModel> {
    const { productId, slug } = query;

    const product = await this.productRepo.findProductInfo(productId, slug);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }
}
