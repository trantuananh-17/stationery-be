import { status } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AdvisorProduct,
  IndexableProduct,
  ProductAiSortBy,
  ProductGrpcService,
  ProductInfoGrpcResponse,
} from '../dto/product-ai.dto';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';

/** Chỉ sản phẩm đang bán mới được đưa vào index ngữ nghĩa. */
const ACTIVE_STATUS = 'ACTIVE';

/** gRPC trả camelCase, nhưng vài nguồn cũ còn snake_case — đọc được cả hai. */
type AdvisorProductAliases = Partial<{
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  brandName: string;
  shortDescription: string;
}>;

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
    advisorIntent?: string;
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
        advisor_intent: input.advisorIntent || '',
      }),
    );

    return response.items || [];
  }

  /** Lấy danh sách sản phẩm để nạp lại toàn bộ index. */
  async listProductsForIndex(limit: number): Promise<IndexableProduct[]> {
    const products = await this.searchProductsForAdvisor({ keyword: '', limit });

    return products
      .map((product) => this.toIndexableProduct(product))
      .filter((product): product is IndexableProduct => product !== null);
  }

  /**
   * Lấy đúng một sản phẩm để cập nhật index sau khi admin sửa sản phẩm đó.
   *
   * `null` chỉ có nghĩa "sản phẩm không còn được index" (đã xoá, hoặc không
   * còn ACTIVE). Lỗi kết nối phải ném ra ngoài — coi nó là "đã xoá" sẽ khiến
   * product-service chết một lúc là index bị dọn sạch.
   */
  async getProductForIndex(productId: string): Promise<IndexableProduct | null> {
    try {
      const product = await firstValueFrom(this.productService.getProductById({ id: productId }));

      return this.fromProductInfo(product);
    } catch (error) {
      if ((error as { code?: number })?.code === status.NOT_FOUND) {
        return null;
      }

      throw error;
    }
  }

  private toIndexableProduct(product: AdvisorProduct): IndexableProduct | null {
    const p = product as AdvisorProduct & AdvisorProductAliases;

    const productId = p.id || p.productId || p.product_id || '';

    if (!productId) return null;

    return {
      productId,
      name: p.productName || p.product_name || '',
      slug: p.slug || '',
      thumbnail: p.thumbnail || '',
      price: Number(p.price ?? 0),
      brandName: p.brandName || p.brand_name || '',
      categoryName: p.categoryName || p.category_name || '',
      shortDescription: p.shortDescription || p.short_description || '',
      description: p.description || '',
    };
  }

  private fromProductInfo(product: ProductInfoGrpcResponse): IndexableProduct | null {
    if (!product?.id || product.status?.toUpperCase() !== ACTIVE_STATUS) {
      return null;
    }

    return {
      productId: product.id,
      name: product.name || '',
      slug: product.slug || '',
      thumbnail: product.thumbnail || '',
      price: this.pickDisplayPrice(product),
      brandName: product.brand?.name || '',
      categoryName: product.category?.name || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
    };
  }

  /** Giá hiển thị: biến thể mặc định, không có thì lấy biến thể rẻ nhất. */
  private pickDisplayPrice(product: ProductInfoGrpcResponse): number {
    const variants = product.variants ?? [];

    if (!variants.length) return 0;

    const defaultVariant = variants.find((variant) => variant.isDefault);

    if (defaultVariant) return Number(defaultVariant.price ?? 0);

    return variants.reduce(
      (min, variant) => Math.min(min, Number(variant.price ?? 0)),
      Number.MAX_SAFE_INTEGER,
    );
  }
}
