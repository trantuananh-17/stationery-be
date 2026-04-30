import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateQuantityDto {
  @ApiPropertyOptional()
  @IsNumber()
  quantity: number;
}
