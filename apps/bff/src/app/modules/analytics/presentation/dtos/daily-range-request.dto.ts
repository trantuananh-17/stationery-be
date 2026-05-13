import { IsISO8601, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DailyRangeRequestDto {
  @ApiProperty({ description: 'Start date in ISO 8601 format', example: '2026-05-01' })
  @IsISO8601()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date in ISO 8601 format', example: '2026-05-13' })
  @IsISO8601()
  @IsNotEmpty()
  endDate: string;
}
