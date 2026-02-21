import { CreateProductTcpRequest } from '@common/interfaces/tcp/product/create-product.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto implements CreateProductTcpRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
