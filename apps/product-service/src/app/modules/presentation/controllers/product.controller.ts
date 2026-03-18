import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductCommand } from '../../application/commands/products/create-product.command.ts/create-product.command';
import { CreateProductDto } from '../dtos/create-product.dto';

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
}
