import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { WebhookService } from '../application/services/webhook.service';
import { Request } from 'express';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new Error('Missing rawBody for Stripe webhook');
    }
    return this.webhookService.handlePaymentIntentWebhook({
      rawBody: req.rawBody,
      signature,
    });
  }
}
