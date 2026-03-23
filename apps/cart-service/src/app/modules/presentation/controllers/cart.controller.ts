import { Body, Controller, Post, Req, UseFilters, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddToCartCommand } from '../../application/commands/add-to-cart/add-to-cart.command';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { AddToCartDto } from '../dtos/add-to-cart.dto';

@Controller()
// @UseInterceptors(GrpcLoggingInterceptor)
// @UseFilters(AuthGrpcExceptionFilter)
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('cart/items')
  @ApiOperation({ summary: 'Add to cart' })
  @ApiResponse({ status: 200, description: 'Add to cart success' })
  addToCart(@OptionalUserData() user: JwtPayload, @Req() req, @Body() body: AddToCartDto) {
    return this.commandBus.execute(
      new AddToCartCommand(
        body.variantId,
        body.quantity,
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440000',
      ),
    );
  }
}
