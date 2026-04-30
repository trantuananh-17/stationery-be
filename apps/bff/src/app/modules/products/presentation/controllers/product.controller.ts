import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductByIdUseCase } from '../../application/get-product-id.usecase';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { GetProductsResponseDto } from '../dtos/get-products-response.dto';
import { GetProductsQueryDto } from '../dtos/get-products-query.dto';
import { GetProductsUseCase } from '../../application/get-products.usecase';
import { GetProductBySlugUseCase } from '../../application/get-product-slug.usecase';
import { CreateProductUseCase } from '../../application/create-product.usecase';
import { CreateProductRequestDto } from '../dtos/create-product.request.dto';
import { UpdateProductUseCase } from '../../application/update-product.usecase';
import { UpdateProductRequestDto } from '../dtos/update-product.request.dto';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly getProductById: GetProductByIdUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
    private readonly getProducts: GetProductsUseCase,
  ) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProductRequestDto) {
    const result = await this.createProduct.execute(body);

    Logger.log(`Create product request: ${JSON.stringify(result)}`);

    return result;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Update product' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: UpdateProductRequestDto) {
    const result = await this.updateProduct.execute({
      id,
      ...body,
    });

    Logger.log(`Update product request: ${JSON.stringify(result)}`);

    return result;
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<GetProductsResponseDto> })
  @ApiOperation({ summary: 'Get products' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetProductsQueryDto) {
    const result = await this.getProducts.execute(query);

    Logger.log(`Get products request: ${JSON.stringify(query)}`);

    return result;
  }

  @Get('/id/:id')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Get product by id' })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    const result = await this.getProductById.execute({ id });

    return result;
  }

  @Get('/slug/:slug')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Get product by slug' })
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    const result = await this.getProductBySlug.execute({ slug });

    return result;
  }
}
