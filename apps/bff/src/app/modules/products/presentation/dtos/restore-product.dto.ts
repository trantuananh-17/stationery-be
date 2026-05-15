import { IsUUID } from 'class-validator';

export class RestoreProductDto {
  @IsUUID()
  id: string;
}
