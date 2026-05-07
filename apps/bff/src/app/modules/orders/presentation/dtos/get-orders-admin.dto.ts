import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const AdminOrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type AdminOrderStatus = (typeof AdminOrderStatus)[keyof typeof AdminOrderStatus];

const AdminOrderOrderBy = {
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',

  TOTAL_ASC: 'total_asc',
  TOTAL_DESC: 'total_desc',

  ORDER_NUMBER_ASC: 'order_number_asc',
  ORDER_NUMBER_DESC: 'order_number_desc',
} as const;

export type AdminOrderOrderBy = (typeof AdminOrderOrderBy)[keyof typeof AdminOrderOrderBy];

export class GetOrdersAdminDto {
  @ApiPropertyOptional({
    description: 'Search by order number',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AdminOrderStatus,
    description: 'Order status',
  })
  @IsOptional()
  @IsIn(Object.values(AdminOrderStatus))
  status?: AdminOrderStatus;

  @ApiPropertyOptional({
    enum: AdminOrderOrderBy,
    description: 'Order by option',
  })
  // @IsOptional()
  // @IsIn(Object.values(AdminOrderOrderBy))
  // orderBy?: AdminOrderOrderBy;
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
