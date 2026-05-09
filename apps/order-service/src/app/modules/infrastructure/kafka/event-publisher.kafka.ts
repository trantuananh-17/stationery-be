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
}
