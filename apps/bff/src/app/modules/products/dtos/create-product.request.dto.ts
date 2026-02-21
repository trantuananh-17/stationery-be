import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product/create-product.interface';

export class CreateProductRequestDto implements CreateProductTcpRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
