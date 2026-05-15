export type ProductAiSortBy = 'relevant' | 'price_asc' | 'price_desc';

export type ProductAiAdvisorIntent =
  | 'general'
  | 'recommend_by_budget'
  | 'quality_durability'
  | 'brand_fit'
  | 'cost_saving'
  | 'combo_bundle'
  | 'alternative_product'
  | 'quantity_advice';

export class GetProductAiDto {
  keyword?: string;
  audience?: string;
  need?: string;
  category?: string;
  brand?: string;
  budgetMin?: number;
  budgetMax?: number;
  sortBy?: ProductAiSortBy;
  limit?: number;
  advisorIntent?: ProductAiAdvisorIntent;
}

export interface SearchProductsForAdvisorGrpcRequest {
  keyword?: string;
  audience?: string;
  need?: string;
  category?: string;
  brand?: string;

  budget_min?: number;
  budget_max?: number;
  sort_by?: ProductAiSortBy;
  limit?: number;
  advisor_intent?: ProductAiAdvisorIntent;

  budgetMin?: number;
  budgetMax?: number;
  sortBy?: ProductAiSortBy;
  advisorIntent?: ProductAiAdvisorIntent;
}

export interface AdvisorProductGrpcDto {
  id: string;

  productId?: string;

  productName: string;
  slug: string;

  categoryId: string;
  categoryName: string;

  brandId: string;
  brandName: string;

  shortDescription: string;
  description: string;
  thumbnail: string;

  variantId: string;
  variantName: string;
  sku: string;

  price: number;
  compareAtPrice: number;
  stock: number;

  variantImage: string;

  featured: boolean;
  productUrl: string;
}

export interface SearchProductsForAdvisorGrpcResponse {
  total: number;
  items: AdvisorProductGrpcDto[];
}
