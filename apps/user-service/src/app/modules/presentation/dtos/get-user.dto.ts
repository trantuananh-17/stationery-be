import { IsUUID } from 'class-validator';

export class getUserDto {
  @IsUUID()
  userId: string;
}
