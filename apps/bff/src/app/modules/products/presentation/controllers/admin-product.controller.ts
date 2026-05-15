import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetProductsResponseDto } from '../dtos/get-products-response.dto';
import { GetAdminProductsQueryDto } from '../dtos/products-by-admin.dto';

import { GetProductsByAdminUseCase } from '../../application/get-products-admin.usecase';
import { DeleteProductUseCase } from '../../application/delete-product.usecase';
import { RestoreProductUseCase } from '../../application/restore-product.usecase';

@ApiTags('Admin Product')
@Controller('admin/products')
export class AdminProductController {
  constructor(
    private readonly getProductsByAdmin: GetProductsByAdminUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly restoreProductUseCase: RestoreProductUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ResponseDto<GetProductsResponseDto> })
  @ApiOperation({ summary: 'Get products by admin' })
  @HttpCode(HttpStatus.OK)
  async findAllByAdmin(@Query() query: GetAdminProductsQueryDto) {
    const normalizedQuery = {
      ...query,
      status: query.status?.trim().toUpperCase(),
    };

    Logger.log(`Get admin products request: ${JSON.stringify(normalizedQuery)}`);

    return this.getProductsByAdmin.execute(normalizedQuery);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete product' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        data: {
          productId: 'uuid',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    Logger.log(`Delete product request: ${id}`);

    return this.deleteProductUseCase.execute({ id });
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted product' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        data: {
          productId: 'uuid',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async restoreProduct(@Param('id') id: string) {
    Logger.log(`Restore product request: ${id}`);

    return this.restoreProductUseCase.execute({ id });
  }
}
