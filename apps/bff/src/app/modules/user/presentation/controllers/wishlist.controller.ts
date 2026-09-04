import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserPort } from '../../application/ports/user.port';
import { WishlistItemBodyDto, WishlistItemResponseDto } from '../dtos/wishlist.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('users/me/wishlist')
export class WishlistController {
  constructor(private readonly userPort: UserPort) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wishlist' })
  @ApiOkResponse({ type: ResponseDto<WishlistItemResponseDto[]> })
  @HttpCode(HttpStatus.OK)
  async getWishlist(@UserData('userId') userId: string) {
    const result = await this.userPort.getWishlist({ userId });

    return result.data ?? [];
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a product to my wishlist' })
  @HttpCode(HttpStatus.CREATED)
  async addItem(@UserData('userId') userId: string, @Body() body: WishlistItemBodyDto) {
    return this.userPort.addWishlistItem({ userId, ...body });
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a product from my wishlist' })
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @UserData('userId') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.userPort.removeWishlistItem({ userId, productId });
  }
}
