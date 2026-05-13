import { IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RecentTransactionsRequestDto {
  @ApiProperty({ description: 'Limit number of transactions', example: 20, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
