import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IProductQueryRepository } from '../../ports/repositories/product-query.repo';
import { GetProductsByAdminQuery } from './get-products-admin.query';
import { ProductReadModel } from '../../read-models/product.read-model';
import { PaginatedResult } from '@common/interfaces/common/pagination.interface';

type GrpcTimestamp = {
  seconds: number;
  nanos: number;
};

export interface ProductAdminGrpcDto {
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

export type GetProductsByAdminResult = PaginatedResult<ProductAdminGrpcDto>;

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

@QueryHandler(GetProductsByAdminQuery)
export class GetProductsByAdminHandler
  implements IQueryHandler<GetProductsByAdminQuery, GetProductsByAdminResult>
{
  constructor(private readonly productRepo: IProductQueryRepository) {}

  async execute(query: GetProductsByAdminQuery): Promise<GetProductsByAdminResult> {
    const { search, status, orderBy, page, limit } = query;

    const keywords = search?.trim() ? search.trim().split(/\s+/).filter(Boolean) : [];

    const result = await this.productRepo.findAll({
      keywords,
      status,
      orderBy,
      page,
      limit,
    });

    const data = result.items.map((product) => ({
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
