export class ProductAiReadModel {
  productId: string;
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
