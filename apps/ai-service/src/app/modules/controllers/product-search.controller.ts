import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IndexProductsDto } from '../dto/product-index.dto';
import { ProductVectorService } from '../services/product-vector.service';

@ApiTags('Product Semantic Search')
@Controller('product-search')
export class ProductSearchController {
  constructor(private readonly productVectorService: ProductVectorService) {}

  @Post('reindex')
  @ApiOperation({ summary: 'Rebuild the whole product embedding index' })
  @HttpCode(HttpStatus.OK)
  reindex() {
    return this.productVectorService.reindexAll();
  }

  @Post('index')
  @ApiOperation({ summary: 'Index or refresh specific products without a full rebuild' })
  @HttpCode(HttpStatus.OK)
  index(@Body() body: IndexProductsDto) {
    return this.productVectorService.indexProducts(body.productIds);
  }

  @Delete('index/:productId')
  @ApiOperation({ summary: 'Drop one product from the embedding index' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.productVectorService.removeProduct(productId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Report how many products are currently indexed' })
  @HttpCode(HttpStatus.OK)
  stats() {
    return this.productVectorService.stats();
  }

  @Post('semantic')
  @ApiOperation({ summary: 'Search products by meaning' })
  @HttpCode(HttpStatus.OK)
  async semantic(@Body() body: { query: string; limit?: number }) {
    const items = await this.productVectorService.search(body.query, body.limit ?? 8);

    return { items };
  }

  @Get('similar/:productId')
  @ApiOperation({ summary: 'Find products similar to a given product' })
  @HttpCode(HttpStatus.OK)
  async similar(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('limit') limit?: string,
  ) {
    const items = await this.productVectorService.similarTo(productId, Number(limit) || 8);

    return { items };
  }
}
