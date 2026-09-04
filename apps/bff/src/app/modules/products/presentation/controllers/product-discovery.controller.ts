import { ROLE } from '@common/constants/enums/role.enum';
import { Roles } from '@common/decorators/role.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RoleGuard } from '@common/guards/role.guard';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AiPort } from '../../application/ports/ai.port';

@ApiTags('Product Discovery')
@Controller()
export class ProductDiscoveryController {
  constructor(private readonly aiPort: AiPort) {}

  @Get('products/semantic-search')
  @ApiOperation({ summary: 'Search products by meaning instead of keywords' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @HttpCode(HttpStatus.OK)
  async semanticSearch(@Query('query') query?: string, @Query('limit') limit?: string) {
    const items = await this.aiPort.semanticSearch(query ?? '', Number(limit) || 8);

    return { items };
  }

  @Get('products/:productId/similar')
  @ApiOperation({ summary: 'Get products similar to a given product' })
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async similar(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('limit') limit?: string,
  ) {
    const items = await this.aiPort.similarProducts(productId, Number(limit) || 8);

    return { items };
  }

  @Post('admin/products/reindex')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rebuild the whole product embedding index' })
  @HttpCode(HttpStatus.OK)
  async reindex() {
    return this.aiPort.reindexProducts();
  }

  @Get('admin/products/index-stats')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report how many products are currently indexed' })
  @HttpCode(HttpStatus.OK)
  async indexStats() {
    return this.aiPort.indexStats();
  }

  @Post('admin/products/:productId/index')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Refresh one product in the embedding index' })
  @HttpCode(HttpStatus.OK)
  async indexProduct(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.aiPort.indexProducts([productId]);
  }

  @Delete('admin/products/:productId/index')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Drop one product from the embedding index' })
  @HttpCode(HttpStatus.OK)
  async removeProductFromIndex(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.aiPort.removeProductFromIndex(productId);
  }
}
