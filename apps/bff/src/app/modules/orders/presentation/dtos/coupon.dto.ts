import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const COUPON_TYPES = ['PERCENT', 'FIXED'] as const;

export class CouponBodyDto {
  @ApiProperty({ example: 'SALE10' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ enum: COUPON_TYPES })
  @IsIn(COUPON_TYPES)
  type: (typeof COUPON_TYPES)[number];

  @ApiProperty({ description: 'PERCENT: 1-100 · FIXED: số tiền', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  value: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Trần giảm cho PERCENT; 0 = không chặn', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiPropertyOptional({ example: '2026-09-01T00:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  startsAt?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @ApiPropertyOptional({ description: '0 = không giới hạn', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  usageLimit?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetCouponsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class ValidateCouponBodyDto {
  @ApiProperty({ example: 'SALE10' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tổng tiền hàng trước giảm giá', example: 500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class CouponResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: COUPON_TYPES })
  type: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  isActive: boolean;
}
