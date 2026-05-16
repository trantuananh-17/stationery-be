import { Injectable } from '@nestjs/common';
import { KafkaService } from '@common/kafka/kafka.service';
import { firstValueFrom } from 'rxjs';
import { IEventPublisher, ItemInput } from '../../application/ports/producers/event-publisher.port';
import {
  SyncCustomerSummaryDto,
  SyncLastOrderDto,
} from '../../application/ports/producers/event.dto';

@Injectable()
export class EventPublisherKafka implements IEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async emitSyncUserSumary(payload: SyncCustomerSummaryDto): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('customer.summary.sync', payload));
  }

  async emitSyncLastOrder(payload: SyncLastOrderDto): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('last-order.sync', payload));
  }

  async emitOrderConfirmed(payload: { eventId: string; items: ItemInput[] }) {
    await firstValueFrom(this.kafkaService.emit('order.confirmed', payload));
  }

  async emitOrderCanceled(payload: { eventId: string; items: ItemInput[] }) {
    await firstValueFrom(this.kafkaService.emit('order.canceled', payload));
  }

  async emitOrderReturned(payload: { eventId: string; items: ItemInput[] }) {
    await firstValueFrom(this.kafkaService.emit('order.returned', payload));
  }

  async emitOrderCreated(payload: {
    eventId: string;
    orderId: string;
    customerId: string;
    customerName: string;
    totalAmount: number;
    totalItems: number;
    createdAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.created',

        payload,
      ),
    );
  }

  async emitOrderPaid(payload: {
    eventId: string;
    orderId: string;
    customerId: string;
    totalAmount: number;
    totalItems: number;
    paidAt: string;
    items: {
      productId: string;
      productName: string;
      categoryId: string;
      categoryName: string;
      quantity: number;
      subtotal: number;
    }[];
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.paid',

        payload,
      ),
    );
  }

  async emitOrderProcessing(payload: {
    eventId: string;
    orderId: string;
    processedAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.processing',

        payload,
      ),
    );
  }

  async emitOrderShipped(payload: {
    eventId: string;
    orderId: string;
    shippedAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.shipped',

        payload,
      ),
    );
  }

  async emitOrderDelivered(payload: {
    eventId: string;
    orderId: string;
    deliveredAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.delivered',

        payload,
      ),
    );
  }

  async emitOrderCancelled(payload: {
    eventId: string;
    orderId: string;
    cancelledAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'order.cancelled',

        payload,
      ),
    );
  }

  async emitNotificationOrderCreated(payload: {
    eventId: string;
    receiverId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'notification.create',

        payload,
      ),
    );
  }

  async emitNotificationPaymentSuccess(payload: {
    eventId: string;
    receiverId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaService.emit(
        'notification.create',

        payload,
      ),
    );
  }
}
