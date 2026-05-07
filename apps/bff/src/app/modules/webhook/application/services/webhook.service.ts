import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EventPublisher } from '../port/event-publisher.port';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly stripe: InstanceType<typeof Stripe>;

  constructor(
    private readonly configService: ConfigService,

    private readonly eventPublisher: EventPublisher,
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_CONFIG.SECRET_KEY'), {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  // async handleCheckoutWebhook(params: { signature: string; rawBody: Buffer }) {
  //   const event = this.verifyWebhookSignature(params.rawBody, params.signature);

  //   this.logger.debug(`Stripe event received: ${event.type}`);

  //   switch (event.type) {
  //     case 'checkout.session.completed': {
  //       const session = event.data.object;

  //       const orderId = session.metadata?.orderId;

  //       if (!orderId) {
  //         this.logger.warn('Missing orderId in Stripe session metadata');
  //         return { received: true };
  //       }

  //       if (session.payment_status === 'paid') {
  //         await this.orderEventPublisher.emitOrderUpdateStatus({
  //           orderId,
  //           status: 'PROCESSING',
  //           paymentStatus: 'PAID',
  //           paymentTransactionId: session.payment_intent as string,
  //           paymentProvider: 'STRIPE',
  //         });
  //       }

  //       // if (session.payment_status === 'unpaid') {
  //       //   await this.orderEventPublisher.emitOrderUpdateStatus({
  //       //     orderId,
  //       //     status: 'PENDING_PAYMENT',
  //       //     paymentId: session.id,
  //       //   });
  //       // }

  //       break;
  //     }

  //     default:
  //       this.logger.log(`Unhandled event type: ${event.type}`);
  //   }

  //   return { received: true };
  // }

  async handlePaymentIntentWebhook(params: { signature: string; rawBody: Buffer }) {
    const event = this.verifyWebhookSignature(params.rawBody, params.signature);

    this.logger.debug(`Stripe event received: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          this.logger.warn('Missing orderId in PaymentIntent metadata');
          return { received: true };
        }

        await this.eventPublisher.emitOrderUpdateStatus({
          eventId: event.id,
          orderId,
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          paymentTransactionId: paymentIntent.id,
          paymentProvider: 'STRIPE',
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          this.logger.warn('Missing orderId in PaymentIntent metadata');
          return { received: true };
        }

        await this.eventPublisher.emitOrderUpdateStatus({
          eventId: event.id,
          orderId,
          status: 'PENDING',
          paymentStatus: 'FAILED',
          paymentTransactionId: paymentIntent.id,
          paymentProvider: 'STRIPE',
        });

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          this.logger.warn('Missing orderId in PaymentIntent metadata');
          return { received: true };
        }

        await this.eventPublisher.emitOrderUpdateStatus({
          eventId: event.id,
          orderId,
          status: 'CANCELED',
          paymentStatus: 'CANCELED',
          paymentTransactionId: paymentIntent.id,
          paymentProvider: 'STRIPE',
        });

        break;
      }

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private verifyWebhookSignature(rawBody: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.configService.getOrThrow<string>('STRIPE_CONFIG.WEBHOOK_SECRET'),
    );
  }
}
