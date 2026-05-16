import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';

import {
  ProductAiAdvisorIntent,
  ProductAiSortBy,
  SearchProductsForAdvisorGrpcRequest,
  SearchProductsForAdvisorGrpcResponse,
} from '../../application/queries/get-product-ai/get-product-ai.dto';
import { GetProductAiQuery } from '../../application/queries/get-product-ai/get-product-ai.query';
import { ProductAiReadModel } from '../../application/read-models/product-ai.read-model';
import { ProductGrpcExceptionFilter } from '../filters/product.filter';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
@UseFilters(ProductGrpcExceptionFilter)
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
        budgetMin: Number(payload.budget_min ?? payload.budgetMin ?? 0),
        budgetMax: Number(payload.budget_max ?? payload.budgetMax ?? 0),
        sortBy: this.normalizeSortBy(payload.sort_by ?? payload.sortBy),
        limit: Number(payload.limit || 8),
        advisorIntent: this.normalizeAdvisorIntent(payload.advisor_intent ?? payload.advisorIntent),
      }),
    );

    return {
      total: products.length,
      items: products.map((product) => ({
        id: product.productId,

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

  private normalizeSortBy(sortBy?: string): ProductAiSortBy {
    if (sortBy === 'price_asc') {
      return 'price_asc';
    }

    if (sortBy === 'price_desc') {
      return 'price_desc';
    }

    return 'relevant';
  }

  private normalizeAdvisorIntent(intent?: string): ProductAiAdvisorIntent {
    const allowedIntents: ProductAiAdvisorIntent[] = [
      'general',
      'recommend_by_budget',
      'quality_durability',
      'brand_fit',
      'cost_saving',
      'combo_bundle',
      'alternative_product',
      'quantity_advice',
    ];

    if (intent && allowedIntents.includes(intent as ProductAiAdvisorIntent)) {
      return intent as ProductAiAdvisorIntent;
    }

    return 'general';
  }
}
