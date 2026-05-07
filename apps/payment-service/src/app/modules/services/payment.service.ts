import { Inject, Injectable, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionRequest, CreatePaymentRequest } from '../interfaces/stripe.interface';
import { OrderPort } from '../applications/ports/order.port';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly stripeService: StripeService,
    @Inject(OrderPort) private readonly orderPort: OrderPort,
  ) {}

  createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(params);
  }

  async createPaymentIntent(params: CreatePaymentRequest) {
    const order = await this.orderPort.getOrderPayment(params);

    const payload: CreateCheckoutSessionRequest = {
      orderId: order.orderId,
      clientEmail: order.email,
      lineItems: order.lineItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    const paymentItent = await this.stripeService.createPaymentIntent(payload);

    return {
      orderId: order.orderId,
      clientEmaiL: order.email,
      totalItem: order.totalItems,
      totalPrice: order.total,
      subTotal: order.subtotal,
      shippingCost: order.shippingCost,
      clientSecret: paymentItent.clientSecret,
      paymentIntentId: paymentItent.paymentIntentId,
    };
  }
}
