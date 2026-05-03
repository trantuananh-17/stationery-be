import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionRequest } from '../interfaces/stripe.interface';

@Injectable()
export class StripeService {
  private readonly stripe: InstanceType<typeof Stripe>;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_CONFIG.SECRET_KEY');

    if (!secretKey) {
      throw new Error('Missing STRIPE_CONFIG.SECRET_KEY');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: this.configService.get('STRIPE_CONFIG.SUCCESS_URL'),
      cancel_url: this.configService.get('STRIPE_CONFIG.CANCEL_URL'),
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      customer_email: params.clientEmail,
      metadata: {
        orderId: params.orderId,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}
