import { Observable } from 'rxjs';

export type ProductAiSortBy = 'relevant' | 'price_asc' | 'price_desc';

export interface SearchProductsForAdvisorRequest {
  keyword?: string;
  audience?: string;
  need?: string;
  category?: string;
  brand?: string;
  budget_min?: number;
  budget_max?: number;
  sort_by?: ProductAiSortBy;
  limit?: number;
  advisor_intent?: string;
}

export interface AdvisorProduct {
  product_id: string;
  product_name: string;
  slug: string;

  category_id: string;
  category_name: string;

  brand_id: string;
  brand_name: string;

  short_description: string;
  description: string;
  thumbnail: string;

  variant_id: string;
  variant_name: string;
  sku: string;

  price: number;
  compare_at_price: number;
  stock: number;

  image: string;
  product_url: string;
}

export interface SearchProductsForAdvisorResponse {
  items: AdvisorProduct[];
}

export interface ProductVariantGrpcResponse {
  id: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
  isDefault: boolean;
}

export interface ProductInfoGrpcResponse {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  shortDescription: string;
  status: string;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  variants?: ProductVariantGrpcResponse[];
}

export interface GetProductByIdRequest {
  id: string;
}

export interface ProductGrpcService {
  searchProductsForAdvisor(
    data: SearchProductsForAdvisorRequest,
  ): Observable<SearchProductsForAdvisorResponse>;

  getProductById(data: GetProductByIdRequest): Observable<ProductInfoGrpcResponse>;
}

/**
 * Hình dạng tối thiểu để nạp một sản phẩm vào index ngữ nghĩa.
 *
 * gRPC (proto-loader mặc định `keepCase: false`) trả camelCase, nhưng một vài
 * chỗ trong repo vẫn khai snake_case — chuẩn hoá về một kiểu duy nhất ở tầng
 * client để phần index không phải đoán tên field.
 */
export type IndexableProduct = {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  brandName: string;
  categoryName: string;
  shortDescription: string;
  description: string;
};

export type ChatTokenUsageDto = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};
