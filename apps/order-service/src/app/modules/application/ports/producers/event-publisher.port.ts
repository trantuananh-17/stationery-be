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
}
