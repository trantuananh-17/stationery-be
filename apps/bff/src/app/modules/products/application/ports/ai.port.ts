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

export abstract class AiPort {
  abstract semanticSearch(query: string, limit?: number): Promise<SemanticProductDto[]>;

  abstract similarProducts(productId: string, limit?: number): Promise<SemanticProductDto[]>;

  abstract reindexProducts(): Promise<{ indexed: number }>;
}
