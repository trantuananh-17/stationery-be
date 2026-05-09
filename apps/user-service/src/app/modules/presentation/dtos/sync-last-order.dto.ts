import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class SyncLastOrderItemAttributeDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class SyncLastOrderItemDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  subtotal: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncLastOrderItemAttributeDto)
  attributes: SyncLastOrderItemAttributeDto[];
}

export class SyncLastOrderDto {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;

  @IsUUID()
  orderId: string;

  @IsString()
  orderNumber: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  orderStatus: string;

  @IsString()
  paymentStatus: string;

  @IsDateString()
  orderedAt: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncLastOrderItemDto)
  items: SyncLastOrderItemDto[];
}
