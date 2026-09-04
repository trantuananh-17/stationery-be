import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddressBodyDto {
  @ApiProperty({ example: 'Trần Tuấn Anh' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'Số 298 đường Cầu Diễn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address1: string;

  @ApiPropertyOptional({ example: 'Toà A, tầng 3' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address2?: string;

  @ApiProperty({ example: 'Phường Minh Khai' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ward: string;

  @ApiProperty({ example: 'Quận Bắc Từ Liêm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @ApiProperty({ example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class AddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address1: string;

  @ApiPropertyOptional()
  address2?: string;

  @ApiProperty()
  ward: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  isDefault: boolean;
}
