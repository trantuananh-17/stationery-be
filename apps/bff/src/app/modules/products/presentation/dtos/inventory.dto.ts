import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetInventoriesQueryDto {
  @ApiPropertyOptional({ description: 'Tìm theo tên sản phẩm, tên biến thể hoặc SKU' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Chỉ lấy biến thể có tồn khả dụng (stock - reserved) <= ngưỡng này',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

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

export class AdjustStockBodyDto {
  @ApiProperty({ description: 'Số tồn kho mới (tuyệt đối)', example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;
}

export class InventoryItemResponseDto {
  @ApiProperty()
  variantId: string;

  @ApiProperty()
  variantName: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  reservedStock: number;

  @ApiProperty()
  isAvailable: boolean;
}
