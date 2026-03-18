import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductCommand } from '../../application/commands/products/create-product/create-product.command';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { UpdateProductCommand } from '../../application/commands/products/update-product/update-product.command';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
