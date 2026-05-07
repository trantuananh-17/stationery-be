export type ItemInput = {
  variantId: string;
  quantity: number;
};

export abstract class IEventPublisher {
  abstract emitOrderConfirmed(payload: { eventId: string; items: ItemInput[] }): Promise<void>;

  abstract emitOrderCanceled(payload: { eventId: string; items: ItemInput[] }): Promise<void>;

  abstract emitOrderReturned(payload: { eventId: string; items: ItemInput[] }): Promise<void>;
}
