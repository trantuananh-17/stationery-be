import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @ApiPropertyOptional()
  @IsString()
  variantId: string;

  @ApiPropertyOptional()
  @IsNumber()
  quantity: number;
}
