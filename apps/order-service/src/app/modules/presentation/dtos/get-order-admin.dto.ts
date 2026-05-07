import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { Type } from 'class-transformer';

import { OrderStatus } from '../../domain/enums/order-status.enum';

export class GetOrdersAdminDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 8;
}
