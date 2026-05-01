import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Controller, Get, HttpCode, HttpStatus, Logger, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetProductsResponseDto } from '../dtos/get-products-response.dto';
import { GetAdminProductsQueryDto } from '../dtos/products-by-admin.dto';
import { GetProductsByAdminUseCase } from '../../application/get-products-admin.usecase';

@ApiTags('Admin Product')
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly getProductsByAdmin: GetProductsByAdminUseCase) {}

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

    const result = await this.getProductsByAdmin.execute(normalizedQuery);

    return result;
  }
}
