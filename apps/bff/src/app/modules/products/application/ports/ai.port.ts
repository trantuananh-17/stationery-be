export type SemanticProductDto = {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  brandName: string;
  categoryName: string;
  score: number;
};

export type ProductIndexResultDto = {
  indexed: string[];
  removed: string[];
};

export type ProductIndexStatsDto = {
  collection: string;
  indexed: number;
};

export abstract class AiPort {
  abstract semanticSearch(query: string, limit?: number): Promise<SemanticProductDto[]>;

  abstract similarProducts(productId: string, limit?: number): Promise<SemanticProductDto[]>;

  abstract reindexProducts(): Promise<{ indexed: number }>;

  abstract indexProducts(productIds: string[]): Promise<ProductIndexResultDto>;

  abstract removeProductFromIndex(productId: string): Promise<{ removed: string }>;

  abstract indexStats(): Promise<ProductIndexStatsDto>;
}
