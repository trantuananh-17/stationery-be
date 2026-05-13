import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { GetProductAiQuery } from './get-product-ai.query';
import { ProductAiReadModel } from '../../read-models/product-ai.read-model';

@QueryHandler(GetProductAiQuery)
export class GetProductAiHandler implements IQueryHandler<GetProductAiQuery, ProductAiReadModel[]> {
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetProductAiQuery): Promise<ProductAiReadModel[]> {
    return this.productRepo.findProductsForAiAdvisor(query.payload);
  }
}
