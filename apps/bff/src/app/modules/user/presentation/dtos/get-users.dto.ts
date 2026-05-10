import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export const AdminUserOrderBy = {
  ORDER_ASC: 'order_asc',
  ORDER_DESC: 'order_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
} as const;

export type AdminUserOrderBy = (typeof AdminUserOrderBy)[keyof typeof AdminUserOrderBy];

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'Search by full name, email or last order number',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AdminUserOrderBy,
    description: 'Order by option',
  })
  @IsOptional()
  @IsIn(Object.values(AdminUserOrderBy))
  orderBy?: AdminUserOrderBy;

  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    default: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
