import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserData } from '@common/decorators/user-data.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';

import { AddToCartUseCase } from '../../applications/add-to-cart.usecase';
import { GetCartUseCase } from '../../applications/get-cart.usecase';
import { GetCartCountUseCase } from '../../applications/get-cart-count.usecase';
import { RemoveCartItemUseCase } from '../../applications/remove-cart-item.usecase';
import { MergeCartUseCase } from '../../applications/merge-cart.usecase';
import { UpdateCartItemQuantityUseCase } from '../../applications/update-cart-item-quantity.usecase';
import { ClearCartUseCase } from '../../applications/clear-cart.usecase';
import { GetCartForCheckoutUseCase } from '../../applications/get-cart-for-checkout.usecase';

import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { UpdateQuantityDto } from '../dtos/update-quantity.dto';
import { OptionalJwtAuthGuard } from '@common/guards/option-jwt-auth.guard';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly getCartCountUseCase: GetCartCountUseCase,
    private readonly getCartForCheckoutUseCase: GetCartForCheckoutUseCase,
    private readonly mergeCartUseCase: MergeCartUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get cart' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  getCart(@OptionalUserData('userId') userId: string, @Headers('x-session-id') sessionId?: string) {
    Logger.log(`Get cart userId: ${userId}, sessionId: ${sessionId}`);

    return this.getCartUseCase.execute({
      userId,
      sessionId,
    });
  }

  @Get('/count')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get cart count' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  getCartCount(
    @OptionalUserData('userId') userId: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    Logger.log(`Get cart count userId: ${userId}, sessionId: ${sessionId}`);

    return this.getCartCountUseCase.execute({
      userId,
      sessionId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/checkout')
  @ApiOperation({ summary: 'Get cart for checkout' })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  getCartForCheckout(@UserData('userId') userId: string) {
    Logger.log(`Get cart for checkout userId: ${userId}`);

    return this.getCartForCheckoutUseCase.execute({
      userId,
    });
  }

  @Post('/add')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  addToCart(
    @OptionalUserData('userId') userId: string,
    @Headers('x-session-id') sessionId: string,
    @Body() body: AddToCartDto,
  ) {
    Logger.log(`Add to cart userId: ${userId}, sessionId: ${sessionId}`);

    return this.addToCartUseCase.execute({
      userId,
      sessionId,
      ...body,
    });
  }

  @Put('/items/:variantId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  updateQuantity(
    @OptionalUserData('userId') userId: string,
    @Headers('x-session-id') sessionId: string,
    @Param('variantId') variantId: string,
    @Body() body: UpdateQuantityDto,
  ) {
    Logger.log(`Update cart quantity variantId: ${variantId}`);

    return this.updateCartItemQuantityUseCase.execute({
      userId,
      sessionId,
      variantId,
      quantity: body.quantity,
    });
  }

  @Delete('/clear')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  clearCart(
    @OptionalUserData('userId') userId: string,
    @Headers('x-session-id') sessionId: string,
  ) {
    Logger.log(`Clear cart userId: ${userId}, sessionId: ${sessionId}`);

    return this.clearCartUseCase.execute({
      userId,
      sessionId,
    });
  }

  @Delete('/items/:cartItemId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiHeader({ name: 'x-session-id', required: false })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  removeItem(
    @OptionalUserData('userId') userId: string,
    @Headers('x-session-id') sessionId: string,
    @Param('cartItemId') cartItemId: string,
  ) {
    Logger.log(`Remove cart item variantId: ${cartItemId}`);

    return this.removeCartItemUseCase.execute({
      userId,
      sessionId,
      cartItemId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('/merge')
  @ApiOperation({ summary: 'Merge guest cart to user cart' })
  @ApiHeader({ name: 'x-session-id', required: true })
  @ApiOkResponse({ type: ResponseDto })
  @HttpCode(HttpStatus.OK)
  mergeCart(@UserData('userId') userId: string, @Headers('x-session-id') sessionId: string) {
    Logger.log(`Merge cart userId: ${userId}, sessionId: ${sessionId}`);

    return this.mergeCartUseCase.execute({
      userId,
      sessionId,
    });
  }
}
