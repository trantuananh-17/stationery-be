import { Body, Controller, Get, Param, Patch, Post, Query, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductCommand } from '../../application/commands/products/create-product/create-product.command';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { UpdateProductCommand } from '../../application/commands/products/update-product/update-product.command';
import { ProductOrderBy } from '../../domain/enum/product-orderby.enum';
import { GetProductsQuery } from '../../application/queries/get-products/get-products.query';
import { GetProductsDto } from '../dtos/get-product.dto';
import { GetProductInfoQuery } from '../../application/queries/get-product-id/get-product-info.query';
import { GetFeaturedDto } from '../dtos/get-fetured.dto';
import { GetFeaturedQuery } from '../../application/queries/get-featured/get-featured.query';
import { GetRelatedProductsDto } from '../dtos/get-related.dto';
import { GetRelatedQuery } from '../../application/queries/get-related/get-related.query';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() body: CreateProductDto) {
    const { product, specifications, variants } = body;

    return this.commandBus.execute(new CreateProductCommand(product, specifications, variants));
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateProductDto) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, body.product, body.specifications, body.variants),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get list products' })
  @ApiResponse({ status: 200, description: 'List products' })
  async getAll(@Query() query: GetProductsDto) {
    const { brand, category, search, orderBy, page, limit } = query;

    return this.queryBus.execute(
      new GetProductsQuery(
        search,
        category,
        brand,
        orderBy as ProductOrderBy,
        Number(page),
        Number(limit),
      ),
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Get featured products' })
  async getFeaturedProducts(@Query() query: GetFeaturedDto) {
    const { page, limit } = query;
    return this.queryBus.execute(new GetFeaturedQuery(Number(page), Number(limit)));
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product detail by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new GetProductInfoQuery(undefined, slug));
  }

  @Get(':id/related')
  async getRelatedProducts(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Query() query: GetRelatedProductsDto,
  ) {
    return this.queryBus.execute(new GetRelatedQuery(productId, Number(query.limit)));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product detail by id' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.queryBus.execute(new GetProductInfoQuery(id, undefined));
  }
}
