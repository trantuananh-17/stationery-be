import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enums/queue.enum';
import { WebhookService } from './application/services/webhook.service';
import { KafkaOrderEventPublisher } from './infrastructure/kafka/kafka-order-event-publisher';
import { EventPublisher } from './application/port/event-publisher.port';

@Module({
  imports: [KafkaModule.register(QUEUE_SERVICES.BFF)],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    {
      provide: EventPublisher,
      useClass: KafkaOrderEventPublisher,
    },
  ],
})
export class WebhookModule {}
