import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProductVectorService } from '../services/product-vector.service';

@ApiTags('Product Semantic Search')
@Controller('product-search')
export class ProductSearchController {
  constructor(private readonly productVectorService: ProductVectorService) {}

  @Post('reindex')
  @ApiOperation({ summary: 'Rebuild the product embedding index' })
  @HttpCode(HttpStatus.OK)
  reindex() {
    return this.productVectorService.reindexAll();
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
  async similar(@Param('productId') productId: string, @Query('limit') limit?: string) {
    const items = await this.productVectorService.similarTo(productId, Number(limit) || 8);

    return { items };
  }
}
