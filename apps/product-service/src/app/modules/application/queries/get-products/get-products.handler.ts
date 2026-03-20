import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ICategoryQueryRepository } from '../../ports/repositories/category-query.repo';
import { ProductReadModel } from '../../read-models/product.read-model';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { PaginatedResult } from '@common/interfaces/common/pagination.interface';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    private readonly categoryRepo: ICategoryQueryRepository,
    private readonly productRepo: IProductQueryRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<PaginatedResult<ProductReadModel>> {
    const { search, brandSlug, categorySlug, orderBy, page, limit } = query;

    let categoryId: string | undefined;

    if (categorySlug?.trim()) {
      categoryId = await this.categoryRepo.findBySlug(categorySlug.trim());

      if (!categoryId) {
        throw new Error('Category not found');
      }
    }

    const keywords = search?.trim() ? search.trim().split(/\s+/).filter(Boolean) : [];

    const result = await this.productRepo.findAll({
      keywords,
      category: categoryId,
      brand: brandSlug?.trim() || undefined,
      orderBy,
      page,
      limit,
    });

    return {
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
