export const ORDER_EVENT_PUBLISHER = Symbol('ORDER_EVENT_PUBLISHER');

export interface OrderEventPublisher {
  emitOrderUpdateStatus(payload: {
    orderId: string;
    status: string;
    paymentStatus: string;
    paymentTransactionId?: string;
    paymentProvider?: string;
  }): Promise<void>;
}
