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

  // brand: {
  //   id: string;
  //   name: string;
  //   slug: string;
  // };
  description: string;
  shortDescription: string;
  status: ProductStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  baseName?: string;

  variants: {
    id: string;
    name: string;
    sku?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    reservedStock: number;
    image?: string;
    sortOrder: number;
    isDefault: boolean;
    isAvailable: boolean;
    attributes: {
      attributeId: string;
      attributeName: string;
      attributeValueId: string;
      attributeValue: string;
      attributeValueSlug: string;
    }[];
  }[];

  variantOptions: {
    attributeId: string;
    attributeName: string;
    values: {
      id: string;
      value: string;
    }[];
  }[];

  specifications: {
    id: string;
    attributeId: string;
    attributeName: string;
    value: string;
  }[];
}
