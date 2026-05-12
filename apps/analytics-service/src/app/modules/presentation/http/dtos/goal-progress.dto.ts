import { IsString } from 'class-validator';

export class GoalProgressDto {
  @IsString()
  bucketMonth: string;
}
