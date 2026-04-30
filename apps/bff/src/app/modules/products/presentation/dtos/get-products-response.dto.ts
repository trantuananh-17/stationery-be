import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductItemResponseDto {
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

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  compareAtPrice?: number;
}

export class GetProductsResponseDto {
  @ApiProperty({ type: [ProductItemResponseDto] })
  items: ProductItemResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
