import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { GetItemQuery } from './get-item.query';
import { ProductItemReadModel } from '../../read-models/product-item.read.model';
import { ProductNotFoundError } from '../../../domain/errors/product.error';

@QueryHandler(GetItemQuery)
export class GetItemHandler implements IQueryHandler<GetItemQuery> {
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetItemQuery): Promise<ProductItemReadModel> {
    const product = await this.productRepo.findProductItemBase(query.variantId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }
}
