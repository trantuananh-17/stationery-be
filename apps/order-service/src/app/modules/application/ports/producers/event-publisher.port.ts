import { SyncCustomerSummaryDto, SyncLastOrderDto } from './event.dto';

export type ItemInput = {
  variantId: string;
  quantity: number;
};

export abstract class IEventPublisher {
  abstract emitOrderConfirmed(payload: { eventId: string; items: ItemInput[] }): Promise<void>;

  abstract emitOrderCanceled(payload: { eventId: string; items: ItemInput[] }): Promise<void>;

  abstract emitOrderReturned(payload: { eventId: string; items: ItemInput[] }): Promise<void>;

  abstract emitSyncUserSumary(payload: SyncCustomerSummaryDto): Promise<void>;

  abstract emitSyncLastOrder(payload: SyncLastOrderDto): Promise<void>;

  abstract emitOrderCreated(payload: {
    eventId: string;
    orderId: string;
    customerId: string;
    customerName: string;
    totalAmount: number;
    totalItems: number;
    createdAt: string;
  }): Promise<void>;

  abstract emitOrderPaid(payload: {
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
  }): Promise<void>;

  abstract emitOrderProcessing(payload: {
    eventId: string;
    orderId: string;
    processedAt: string;
  }): Promise<void>;

  abstract emitOrderShipped(payload: {
    eventId: string;
    orderId: string;
    shippedAt: string;
  }): Promise<void>;

  abstract emitOrderDelivered(payload: {
    eventId: string;
    orderId: string;
    deliveredAt: string;
  }): Promise<void>;

  abstract emitOrderCancelled(payload: {
    eventId: string;
    orderId: string;
    cancelledAt: string;
  }): Promise<void>;
}
