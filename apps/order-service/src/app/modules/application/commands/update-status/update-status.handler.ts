import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusCommand } from './update-status.command';
import { IOrderCommandRepository } from '../../ports/repositories/order-command.repo';
import { IEventPublisher } from '../../ports/producers/event-publisher.port';
import { OrderStatus } from '../../../domain/enums/order-status.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { OrderNotFound } from '../../../domain/errors/order.error';
import * as crypto from 'crypto';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand, void> {
  constructor(
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
    const { orderId, orderStatus } = command;

    const order = await this.orderCommandRepo.findById(orderId);
    if (!order) throw new OrderNotFound();

    const projectionPromises: Promise<void>[] = [];

    switch (orderStatus) {
      case OrderStatus.PROCESSING:
        order.markProcessing();
        projectionPromises.push(
          this.eventPublisher.emitOrderProcessing({
            eventId: crypto.randomUUID(),
            orderId: order.id,
            processedAt: new Date().toISOString(),
          }),
        );
        break;

      case OrderStatus.SHIPPED:
        order.markShipped();
        projectionPromises.push(
          this.eventPublisher.emitOrderShipped({
            eventId: crypto.randomUUID(),
            orderId: order.id,
            shippedAt: new Date().toISOString(),
          }),
        );
        break;

      case OrderStatus.DELIVERED:
        order.markDelivered();

        // Đơn COD chốt kho ở bước giao thành công; đơn Stripe đã chốt lúc thanh toán.
        if (order.paymentMethod === 'cod') {
          projectionPromises.push(
            this.eventPublisher.emitOrderConfirmed({
              eventId: crypto.randomUUID(),
              items: order.items.map((item) => ({
                variantId: item.variantId,
                quantity: item.quantity,
              })),
            }),
          );
        }

        if (order.paymentMethod === 'cod' && order.paymentStatus !== PaymentStatus.PAID) {
          order.markPaid();

          projectionPromises.push(
            this.eventPublisher.emitOrderPaid({
              eventId: crypto.randomUUID(),
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
        }
        projectionPromises.push(
          this.eventPublisher.emitOrderDelivered({
            eventId: crypto.randomUUID(),
            orderId: order.id,
            deliveredAt: new Date().toISOString(),
          }),
        );
        break;

      case OrderStatus.RETURNED:
        order.markReturned();

        // Trả hàng: hoàn kho phần đã trừ thật (khác 'order.canceled' vốn chỉ nhả phần đang giữ).
        projectionPromises.push(
          this.eventPublisher.emitOrderReturned({
            eventId: crypto.randomUUID(),
            items: order.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }),
        );

        // Đơn đã thanh toán thì đánh dấu hoàn tiền; đơn COD chưa thu tiền thì không.
        if (order.paymentStatus === PaymentStatus.PAID) {
          order.refund(order.paymentTransactionId);
        }

        break;

      case OrderStatus.CANCELLED:
        order.cancel();

        projectionPromises.push(
          this.eventPublisher.emitOrderCanceled({
            eventId: crypto.randomUUID(),
            items: order.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }),
        );

        projectionPromises.push(
          this.eventPublisher.emitOrderCancelled({
            eventId: crypto.randomUUID(),
            orderId: order.id,
            cancelledAt: new Date().toISOString(),
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

    if (order.paymentMethod === 'cod' && order.paymentStatus === PaymentStatus.PAID) {
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
    }

    await Promise.all(projectionPromises);
  }
}
