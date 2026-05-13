import { IsISO8601, IsInt, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TopProductsRequestDto {
  @ApiProperty({ description: 'Start date in ISO 8601 format', example: '2026-05-01' })
  @IsISO8601()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date in ISO 8601 format', example: '2026-05-13' })
  @IsISO8601()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Limit of top products', example: 10, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
