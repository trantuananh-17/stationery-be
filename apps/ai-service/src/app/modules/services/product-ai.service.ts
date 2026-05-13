import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AdvisorProduct, ProductAiSortBy, ProductGrpcService } from '../dto/product-ai.dto';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';

@Injectable()
export class ProductAiGrpcClientService implements OnModuleInit {
  private productService: ProductGrpcService;

  constructor(@Inject(GRPC_SERVICES.PRODUCT_SERVICE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductGrpcService>('ProductService');
  }

  async searchProductsForAdvisor(input: {
    keyword?: string;
    audience?: string;
    need?: string;
    category?: string;
    brand?: string;
    budgetMin?: number;
    budgetMax?: number;
    sortBy?: ProductAiSortBy;
    limit?: number;
  }): Promise<AdvisorProduct[]> {
    const response = await firstValueFrom(
      this.productService.searchProductsForAdvisor({
        keyword: input.keyword || '',
        audience: input.audience || '',
        need: input.need || '',
        category: input.category || '',
        brand: input.brand || '',
        budget_min: Number(input.budgetMin || 0),
        budget_max: Number(input.budgetMax || 0),
        sort_by: input.sortBy || 'relevant',
        limit: Number(input.limit || 8),
      }),
    );

    return response.items || [];
  }
}
