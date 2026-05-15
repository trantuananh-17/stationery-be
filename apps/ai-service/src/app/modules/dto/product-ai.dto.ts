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

export interface ProductGrpcService {
  searchProductsForAdvisor(
    data: SearchProductsForAdvisorRequest,
  ): Observable<SearchProductsForAdvisorResponse>;
}

export type ChatTokenUsageDto = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};
