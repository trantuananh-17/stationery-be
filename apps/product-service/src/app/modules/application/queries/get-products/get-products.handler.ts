import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ICategoryQueryRepository } from '../../ports/repositories/category-query.repo';
import { ProductReadModel } from '../../read-models/product.read-model';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { CategoryNotFoundError } from '../../../domain/errors/category.error';
import { BrandNotFoundError } from '../../../domain/errors/brand.error';
import { IBrandQueryRepository } from '../../ports/repositories/brand-query.repo';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    private readonly productRepo: IProductQueryRepository,
    private readonly categoryRepo: ICategoryQueryRepository,
    private readonly brandRepo: IBrandQueryRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<PaginatedResult<ProductReadModel>> {
    const { search, brandSlug, categorySlug, orderBy, page, limit } = query;

    let categoryId: string | undefined;
    let brandId: string | undefined;

    if (categorySlug?.trim()) {
      categoryId = await this.categoryRepo.findBySlug(categorySlug.trim());

      if (!categoryId) {
        throw new CategoryNotFoundError();
      }
    }

    if (brandSlug?.trim()) {
      brandId = await this.brandRepo.findBySlug(brandSlug.trim());

      if (!brandId) {
        throw new BrandNotFoundError();
      }
    }

    const keywords = search?.trim() ? search.trim().split(/\s+/).filter(Boolean) : [];

    const result = await this.productRepo.findAll({
      keywords,
      category: categoryId,
      brand: brandId,
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
