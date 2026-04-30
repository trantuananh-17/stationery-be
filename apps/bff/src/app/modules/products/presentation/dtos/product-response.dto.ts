import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductCategoryParentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class ProductCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional({ type: ProductCategoryParentResponseDto })
  parent?: ProductCategoryParentResponseDto;
}

export class ProductVariantAttributeResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  attributeName: string;

  @ApiProperty()
  attributeValueId: string;

  @ApiProperty()
  attributeValue: string;

  @ApiProperty()
  attributeValueSlug: string;
}

export class ProductVariantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  sku?: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  compareAtPrice?: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  reservedStock: number;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty({ type: [ProductVariantAttributeResponseDto] })
  attributes: ProductVariantAttributeResponseDto[];
}

export class ProductVariantOptionValueResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;
}

export class ProductVariantOptionResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  attributeName: string;

  @ApiProperty({ type: [ProductVariantOptionValueResponseDto] })
  values: ProductVariantOptionValueResponseDto[];
}

export class ProductSpecificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  attributeName: string;

  @ApiProperty()
  value: string;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty({ type: ProductCategoryResponseDto })
  category: ProductCategoryResponseDto;

  @ApiProperty()
  description: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  featured: boolean;

  @ApiPropertyOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  seoDescription?: string;

  @ApiPropertyOptional()
  baseName?: string;

  @ApiProperty({ type: [ProductVariantResponseDto] })
  variants: ProductVariantResponseDto[];

  @ApiProperty({ type: [ProductVariantOptionResponseDto] })
  variantOptions: ProductVariantOptionResponseDto[];

  @ApiProperty({ type: [ProductSpecificationResponseDto] })
  specifications: ProductSpecificationResponseDto[];
}
