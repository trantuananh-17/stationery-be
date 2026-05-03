import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  // constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log(req);
    console.log(signature);

    return;
  }
}
