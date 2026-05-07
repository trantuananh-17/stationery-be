export const ORDER_COMMAND_PUBLISHER = Symbol('ORDER_COMMAND_PUBLISHER');

export abstract class EventPublisher {
  abstract emitOrderUpdateStatus(payload: {
    eventId: string;
    orderId: string;
    status: string;
    paymentStatus: string;
    paymentTransactionId?: string;
    paymentProvider?: string;
  }): Promise<void>;
}
