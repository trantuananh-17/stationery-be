import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ICategoryQueryRepository } from '../../ports/repositories/category-query.repo';
import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { CategoryNotFoundError } from '../../../domain/errors/category.error';
import { BrandNotFoundError } from '../../../domain/errors/brand.error';
import { IBrandQueryRepository } from '../../ports/repositories/brand-query.repo';

type GrpcTimestamp = {
  seconds: number;
  nanos: number;
};

const toTimestamp = (date?: Date | string | null): GrpcTimestamp | undefined => {
  if (!date) return undefined;

  const value = date instanceof Date ? date : new Date(date);
  const time = value.getTime();

  if (Number.isNaN(time)) return undefined;

  return {
    seconds: Math.floor(time / 1000),
    nanos: (time % 1000) * 1_000_000,
  };
};

export interface ProductGrpcReadModel {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  status: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  createdAt?: GrpcTimestamp;
}

export type GetProductsResult = PaginatedResult<ProductGrpcReadModel>;

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery, GetProductsResult> {
  constructor(
    private readonly productRepo: IProductQueryRepository,
    private readonly categoryRepo: ICategoryQueryRepository,
    private readonly brandRepo: IBrandQueryRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<GetProductsResult> {
    const { search, brandSlug, categorySlug, orderBy, page, limit } = query;

    let categoryId: string | undefined;
    let brandId: string | undefined;

    if (categorySlug?.trim()) {
      categoryId = (await this.categoryRepo.findBySlug(categorySlug.trim())) ?? undefined;

      if (!categoryId) {
        throw new CategoryNotFoundError();
      }
    }

    if (brandSlug?.trim()) {
      brandId = (await this.brandRepo.findBySlug(brandSlug.trim())) ?? undefined;

      if (!brandId) {
        throw new BrandNotFoundError();
      }
    }

    const keywords = search?.trim() ? search.trim().split(/\s+/).filter(Boolean) : [];

    const result = await this.productRepo.findAllActive({
      keywords,
      category: categoryId,
      brand: brandId,
      orderBy,
      page,
      limit,
    });

    const data: ProductGrpcReadModel[] = result.items.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      description: product.description,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      status: product.status,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      createdAt: toTimestamp(product.createdAt),
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
