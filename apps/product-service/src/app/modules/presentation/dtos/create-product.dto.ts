import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  shortDescription: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  brandId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @IsString()
  thumbnail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;
}

class SpecificationDto {
  @ApiProperty()
  @IsString()
  attributeId: string;

  @ApiProperty()
  @IsString()
  value: string;
}

class VariantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  stock: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  images?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  attributeValueIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  attributeValueSlug: string[];
}

export class CreateProductDto {
  @ApiProperty({ type: ProductDto })
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications: SpecificationDto[];

  @ApiProperty({ type: [VariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
