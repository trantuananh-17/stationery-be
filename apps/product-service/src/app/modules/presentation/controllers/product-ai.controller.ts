import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';

import {
  SearchProductsForAdvisorGrpcRequest,
  SearchProductsForAdvisorGrpcResponse,
} from '../../application/queries/get-product-ai/get-product-ai.dto';
import { GetProductAiQuery } from '../../application/queries/get-product-ai/get-product-ai.query';
import { ProductAiReadModel } from '../../application/read-models/product-ai.read-model';

@Controller()
export class ProductAiController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod('ProductService', 'searchProductsForAdvisor')
  async searchProductsForAdvisor(
    @Payload() payload: SearchProductsForAdvisorGrpcRequest,
  ): Promise<SearchProductsForAdvisorGrpcResponse> {
    const products = await this.queryBus.execute<GetProductAiQuery, ProductAiReadModel[]>(
      new GetProductAiQuery({
        keyword: payload.keyword || '',
        audience: payload.audience || '',
        need: payload.need || '',
        category: payload.category || '',
        brand: payload.brand || '',
        budgetMin: Number(payload.budget_min || 0),
        budgetMax: Number(payload.budget_max || 0),
        sortBy: payload.sort_by || 'relevant',
        limit: Number(payload.limit || 8),
      }),
    );

    console.log(products);

    return {
      total: products.length,
      items: products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        slug: product.slug,

        categoryId: product.categoryId,
        categoryName: product.categoryName,

        brandId: product.brandId,
        brandName: product.brandName,

        description: product.description,
        shortDescription: product.shortDescription,
        thumbnail: product.thumbnail,

        variantId: product.variantId,
        variantName: product.variantName,
        sku: product.sku,

        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,

        variantImage: product.variantImage,

        featured: product.featured,
        productUrl: product.productUrl,
      })),
    };
  }
}
