import { IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SyncCustomerSummaryDto {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsNumber()
  amountSpentIncrement?: number;

  @IsOptional()
  @IsNumber()
  totalOrdersIncrement?: number;

  @IsOptional()
  @IsUUID()
  lastOrderId?: string;

  @IsOptional()
  @IsNumber()
  lastOrderTotal?: number;

  @IsOptional()
  @IsDateString()
  lastOrderAt?: Date;
}
