import { IsDateString, IsOptional, IsNumberString } from 'class-validator';

export class TopProductsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
