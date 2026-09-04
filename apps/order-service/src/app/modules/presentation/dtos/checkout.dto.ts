import { OrderAddress } from '../../domain/entities/order.entity';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CheckoutAddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CheckoutDto {
  @ValidateNested()
  @Type(() => CheckoutAddressDto)
  shippingAddress: CheckoutAddressDto;

  @ValidateNested()
  @Type(() => CheckoutAddressDto)
  billingAddress: CheckoutAddressDto;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

/** Payload của rpc `checkout` — userId/email do BFF lấy từ JWT rồi gửi kèm. */
export type CheckoutGrpcRequest = {
  userId: string;
  email: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
};
