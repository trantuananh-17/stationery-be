import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOrderBy } from '../../domain/enum/product-orderby.enum';

export class GetProductsDto {
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Category ID or slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Brand ID or slug' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ enum: ProductOrderBy, description: 'Order by option' })
  @IsOptional()
  @IsString()
  orderBy?: ProductOrderBy;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
