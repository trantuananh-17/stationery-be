import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { OrderStatus } from '../../applications/ports/dtos/order.dto';

const AdminOrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delevered',
  CANCELLED: 'cancelled',
} as const;

export type AdminOrderStatus = (typeof AdminOrderStatus)[keyof typeof AdminOrderStatus];

export class GetOrdersByUserIdDto {
  @IsOptional()
  @IsIn(Object.values(AdminOrderStatus))
  status?: AdminOrderStatus;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
