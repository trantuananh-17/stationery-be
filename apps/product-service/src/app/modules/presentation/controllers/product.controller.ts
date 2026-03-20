import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, body.product, body.specifications, body.variants),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get list products' })
  @ApiResponse({ status: 200, description: 'List products' })
  async findAll(@Query() query: GetProductsDto) {
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

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product detail by id' })
  async findById(@Param('id') id: string) {
    return this.queryBus.execute(new GetProductInfoQuery(id, undefined));
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product detail by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new GetProductInfoQuery(undefined, slug));
  }
}
