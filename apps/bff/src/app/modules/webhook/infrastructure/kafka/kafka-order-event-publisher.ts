import { Injectable } from '@nestjs/common';
import { KafkaService } from '@common/kafka/kafka.service';
import { OrderEventPublisher } from '../../application/port/event-publisher.port';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaOrderEventPublisher implements OrderEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async emitOrderUpdateStatus(payload: {
    orderId: string;
    status: string;
    paymentId?: string;
  }): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('order.update-status', payload));
  }
}
