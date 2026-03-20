import { ProductStatus } from '../../domain/enum/product-status.enum';

export interface ProductInfoReadModel {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  images: string[];

  category: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };

  brand: {
    id: string;
    name: string;
    slug: string;
  };

  description: string;
  shortDescription: string;

  status: ProductStatus;
  featured: boolean;

  seoTitle?: string;
  seoDescription?: string;

  variants: {
    id: string;
    name: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    reservedStock: number;
    images?: string[];
    sortOrder: number;
    isDefault: boolean;
    isAvailable: boolean;
  }[];

  specifications: {
    id: string;
    attributeName: string;
    value: string;
  }[];
}
