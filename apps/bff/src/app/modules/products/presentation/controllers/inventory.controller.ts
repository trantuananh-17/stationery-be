import { ROLE } from '@common/constants/enums/role.enum';
import { Roles } from '@common/decorators/role.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RoleGuard } from '@common/guards/role.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AdjustStockUseCase } from '../../application/adjust-stock.usecase';
import { GetInventoriesUseCase } from '../../application/get-inventories.usecase';
import {
  AdjustStockBodyDto,
  GetInventoriesQueryDto,
  InventoryItemResponseDto,
} from '../dtos/inventory.dto';

@ApiTags('Admin Inventory')
@ApiBearerAuth()
@Controller('admin/inventories')
export class InventoryController {
  constructor(
    private readonly getInventories: GetInventoriesUseCase,
    private readonly adjustStock: AdjustStockUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Get inventories by admin' })
  @ApiOkResponse({ type: ResponseDto<InventoryItemResponseDto[]> })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetInventoriesQueryDto) {
    Logger.log(`Get inventories request: ${JSON.stringify(query)}`);

    const result = await this.getInventories.execute(query);

    return {
      items: result.data ?? [],
      total: result.total ?? 0,
      page: result.page ?? query.page,
      limit: result.limit ?? query.limit,
      totalPages: result.totalPages ?? 0,
    };
  }

  @Patch(':variantId/stock')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Adjust stock of a variant' })
  @ApiParam({ name: 'variantId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async adjust(
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Body() body: AdjustStockBodyDto,
  ) {
    Logger.log(`Adjust stock request: ${variantId} -> ${body.stock}`);

    return this.adjustStock.execute({ variantId, stock: body.stock });
  }
}
