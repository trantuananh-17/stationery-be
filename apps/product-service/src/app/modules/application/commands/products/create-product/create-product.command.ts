import { ICommand } from '@nestjs/cqrs';

type ProductPayload = {
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  brandId: string;
  images: string[];
  thumbnail: string;
  featured?: boolean;
  searchKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type SpecificationPayload = {
  attributeId: string;
  value: string;
};

export type VariantPayload = {
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
  sortOrder?: number;
  isDefault?: boolean;
  attributeValueIds: string[];
  attributeValueSlug: string[];
};

export class CreateProductCommand implements ICommand {
  constructor(
    public readonly product: ProductPayload,
    public readonly specifications: SpecificationPayload[],
    public readonly variants: VariantPayload[],
  ) {}
}
