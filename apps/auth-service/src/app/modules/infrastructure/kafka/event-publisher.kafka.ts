import { Injectable } from '@nestjs/common';
import { KafkaService } from '@common/kafka/kafka.service';
import { firstValueFrom } from 'rxjs';
import { IEventPublisher } from '../../application/ports/producers/event-publisher.port';

@Injectable()
export class EventPublisherKafka implements IEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async emitCustomerSummarySync(payload: {
    eventId: string;
    userId: string;
    email: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('customer.summary.sync', payload));
  }
}
