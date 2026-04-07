import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddToCartCommand } from '../../application/commands/add-to-cart/add-to-cart.command';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { UpdateQuantityDto } from '../dtos/update-quantity.dto';
import { UpdateQuantityCommand } from '../../application/commands/update-quantity/update-quantity.command';
import { GetCartQuery } from '../../application/queries/get-cart/get-cart.query';
import { GetCartCountQuery } from '../../application/queries/get-cart-count/get-cart-count.query';
import { RemoveItemCommand } from '../../application/commands/remove-item/remove-item.command';

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
  addToCart(@OptionalUserData() user: JwtPayload, @Req() req: Request, @Body() body: AddToCartDto) {
    return this.commandBus.execute(
      new AddToCartCommand(
        body.variantId,
        body.quantity,
        undefined,
        '550e8400-e29b-41d4-a716-446655440000',
      ),
    );
  }

  @Put('cart/items/:variantId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Update quantity success' })
  updateQuantity(
    @Param('variantId') variantId: string,
    @Body() body: UpdateQuantityDto,
    @OptionalUserData() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new UpdateQuantityCommand(
        variantId,
        body.quantity,
        undefined,
        '550e8400-e29b-41d4-a716-446655440000',
      ),
    );
  }

  @Get('cart/')
  @ApiOperation({ summary: 'Get cart info' })
  @ApiResponse({ status: 200, description: 'Update quantity success' })
  getCart(@OptionalUserData() user: JwtPayload, @Req() req: Request) {
    return this.queryBus.execute(
      new GetCartQuery(undefined, '550e8400-e29b-41d4-a716-446655440000'),
    );
  }

  @Get('cart/count')
  @ApiOperation({ summary: 'Get cart info' })
  @ApiResponse({ status: 200, description: 'Update quantity success' })
  getCartCount(@OptionalUserData() user: JwtPayload, @Req() req: Request) {
    return this.queryBus.execute(
      new GetCartCountQuery(undefined, '550e8400-e29b-41d4-a716-446655440000'),
    );
  }

  @Delete('cart/items/:cartItemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Remove cart item success' })
  async removeItem(
    @Param('cartItemId') cartItemId: string,
    @OptionalUserData() user: JwtPayload,
    @Req() req: Request,
  ) {
    return await this.commandBus.execute(
      new RemoveItemCommand(cartItemId, undefined, '550e8400-e29b-41d4-a716-446655440001'),
    );
  }
}
