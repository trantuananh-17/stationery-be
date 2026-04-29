import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OptionalUserData } from '@common/decorators/optional-user-data.decorator';
import { CheckoutCommand } from '../../application/commands/checkout/checkout.command';
import { JwtPayload } from '@common/interfaces/common/jwt-payload.interface';
import { CheckoutDto } from '../dtos/checkout.dto';

@Controller()
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('order/checkout')
  @ApiOperation({ summary: 'Add to cart' })
  @ApiResponse({ status: 200, description: 'Add to cart success' })
  addToCart(@OptionalUserData() user: JwtPayload, @Req() req: Request, @Body() body: CheckoutDto) {
    return this.commandBus.execute(
      new CheckoutCommand(
        '550e8400-e29b-41d4-a716-446655440001',
        body.shippingAddress,
        body.billingAddress,
        body.paymentMethod,
        body.notes,
        body.couponCode,
      ),
    );
  }
}
