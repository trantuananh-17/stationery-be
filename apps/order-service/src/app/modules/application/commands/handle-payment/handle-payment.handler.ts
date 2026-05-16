import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { IEventPublisher } from '../../ports/producers/event-publisher.port';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';
import { OrderNotFound } from '../../../domain/errors/order.error';
import { HandlePaymentCommand } from './handle-payment.command';

@CommandHandler(HandlePaymentCommand)
export class HandlePaymentHandler implements ICommandHandler<HandlePaymentCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: HandlePaymentCommand): Promise<void> {
    const { eventId, orderId, paymentStatus, paymentTransactionId, paymentProvider } = command;

    const order = await this.orderCommandRepo.findById(orderId);
    if (!order) throw new OrderNotFound();

    if (paymentStatus === PaymentStatus.PAID && order.paymentStatus === PaymentStatus.PAID) return;

    const projectionPromises: Promise<void>[] = [];

    switch (paymentStatus) {
      case PaymentStatus.PAID:
        order.markProcessing();
        projectionPromises.push(
          this.eventPublisher.emitOrderProcessing({
            eventId,
            orderId: order.id,
            processedAt: new Date().toISOString(),
          }),
        );

        order.markPaid(paymentTransactionId, paymentProvider);

        projectionPromises.push(
          this.eventPublisher.emitSyncUserSumary({
            userId: order.userId,
            email: order.email,
            amountSpentIncrement: order.total,
            totalOrdersIncrement: 1,
            lastOrderId: order.id,
            lastOrderTotal: order.total,
            lastOrderAt: order.createdAt,
          }),
        );

        projectionPromises.push(
          this.eventPublisher.emitOrderPaid({
            eventId,
            orderId: order.id,
            customerId: order.userId,
            totalAmount: order.total,
            totalItems: order.totalItems,
            paidAt: new Date().toISOString(),
            items: order.items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              categoryId: '00000000-0000-0000-0000-000000000000',
              categoryName: 'Unknown Category',
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          }),
        );

        projectionPromises.push(
          this.eventPublisher.emitNotificationPaymentSuccess({
            eventId,
            receiverId: 'e6d14eb9-268c-4a74-88b0-4b0d9731443b',
            type: 'PAYMENT_SUCCESS',
            title: 'Thanh toán thành công',
            message: `Đơn hàng ${order.number} đã được thanh toán thành công`,
            metadata: {
              orderId: order.id,
              orderNumber: order.number,
              totalAmount: order.total,
              paymentProvider,
              paymentTransactionId,
            },

            createdAt: new Date().toISOString(),
          }),
        );

        break;

      case PaymentStatus.FAILED:
        order.markPaymentFailed(paymentTransactionId, paymentProvider);
        projectionPromises.push(
          this.eventPublisher.emitOrderCanceled({
            eventId,
            items: order.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }),
        );
        break;
    }

    await this.orderCommandRepo.save(order);

    projectionPromises.push(
      this.eventPublisher.emitSyncLastOrder({
        userId: order.userId,
        orderId: order.id,
        orderNumber: order.number,
        totalPrice: order.total,
        orderStatus: order.status,
        paymentStatus: order.paymentStatus,
        orderedAt: order.createdAt,
        items: order.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          thumbnail: item.image,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          attributes: item.attributes ?? [],
        })),
      }),
    );

    await Promise.all(projectionPromises);
  }
}
