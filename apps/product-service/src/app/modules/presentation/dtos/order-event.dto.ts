import { IsString, ValidateNested, IsArray, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemInput {
  @IsUUID()
  variantId: string;

  @IsNumber()
  quantity: number;
}

export class OrderEventDto {
  @IsString()
  eventId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemInput)
  items: ItemInput[];
}
