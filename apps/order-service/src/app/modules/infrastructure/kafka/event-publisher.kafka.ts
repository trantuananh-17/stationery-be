import { Injectable } from '@nestjs/common';
import { KafkaService } from '@common/kafka/kafka.service';
import { firstValueFrom } from 'rxjs';
import { IEventPublisher, ItemInput } from '../../application/ports/producers/event-publisher.port';

@Injectable()
export class EventPublisherKafka implements IEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

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
