import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoalProgressRequestDto {
  @ApiProperty({ description: 'Bucket month in format YYYY-MM', example: '2026-05' })
  @IsString()
  @IsNotEmpty()
  bucketMonth: string;
}
