import { ROLE } from '@common/constants/enums/role.enum';
import { Roles } from '@common/decorators/role.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RoleGuard } from '@common/guards/role.guard';
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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CouponUseCase, ShippingQuoteUseCase } from '../../application/coupon.usecase';
import {
  CouponBodyDto,
  CouponResponseDto,
  GetCouponsQueryDto,
  ValidateCouponBodyDto,
} from '../dtos/coupon.dto';

@ApiTags('Coupon')
@ApiBearerAuth()
@Controller()
export class CouponController {
  constructor(
    private readonly couponUseCase: CouponUseCase,
    private readonly shippingQuoteUseCase: ShippingQuoteUseCase,
  ) {}

  @Get('shipping/quote')
  @ApiOperation({ summary: 'Get shipping fee for an order amount' })
  @HttpCode(HttpStatus.OK)
  async shippingQuote(@Query('amount') amount?: string) {
    return this.shippingQuoteUseCase.getQuote(Number(amount) || 0);
  }

  @Post('coupons/validate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validate a coupon against a subtotal' })
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: ValidateCouponBodyDto) {
    return this.couponUseCase.validateCoupon(body);
  }

  @Get('admin/coupons')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Get coupons by admin' })
  @ApiOkResponse({ type: ResponseDto<CouponResponseDto[]> })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetCouponsQueryDto) {
    const result = await this.couponUseCase.getCoupons(query);

    return {
      items: result.data ?? [],
      total: result.total ?? 0,
      page: result.page ?? query.page,
      limit: result.limit ?? query.limit,
      totalPages: result.totalPages ?? 0,
    };
  }

  @Post('admin/coupons')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Create a coupon' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CouponBodyDto) {
    const result = await this.couponUseCase.createCoupon(body);

    return result.data;
  }

  @Put('admin/coupons/:couponId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiParam({ name: 'couponId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('couponId', new ParseUUIDPipe()) couponId: string,
    @Body() body: CouponBodyDto,
  ) {
    const result = await this.couponUseCase.updateCoupon({ couponId, input: body });

    return result.data;
  }

  @Delete('admin/coupons/:couponId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiParam({ name: 'couponId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('couponId', new ParseUUIDPipe()) couponId: string) {
    return this.couponUseCase.deleteCoupon({ couponId });
  }
}
