import { ICommand } from '@nestjs/cqrs';

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  thumbnail?: string;
  featured?: boolean;
  searchKeywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type UpdateSpecificationPayload = {
  id?: string;
  attributeId: string;
  value: string;
};

export type UpdateVariantPayload = {
  id?: string;
  name?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images?: string;
  sortOrder?: number;
  isDefault?: boolean;
  attributeValueIds: string[];
  attributeValueSlug: string[];
};

export class UpdateProductCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly product: UpdateProductPayload,
    public readonly specifications?: UpdateSpecificationPayload[],
    public readonly variants?: UpdateVariantPayload[],
  ) {}
}
