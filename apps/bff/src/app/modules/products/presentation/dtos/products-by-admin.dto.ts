import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const AdminProductOrderBy = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  STOCK_ASC: 'stock_asc',
  STOCK_DESC: 'stock_desc',
} as const;

export type AdminProductOrderBy = (typeof AdminProductOrderBy)[keyof typeof AdminProductOrderBy];

const AdminProductStatus = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type AdminProductStatus = (typeof AdminProductStatus)[keyof typeof AdminProductStatus];

export class GetAdminProductsQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AdminProductStatus,
    description: 'Product status',
  })
  @IsOptional()
  @IsIn(Object.values(AdminProductStatus))
  status?: AdminProductStatus;

  @ApiPropertyOptional({
    enum: AdminProductOrderBy,
    description: 'Order by option',
  })
  @IsOptional()
  @IsIn(Object.values(AdminProductOrderBy))
  orderBy?: AdminProductOrderBy;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
