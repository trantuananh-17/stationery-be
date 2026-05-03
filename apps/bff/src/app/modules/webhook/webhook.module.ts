import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enums/queue.enum';
import { WebhookService } from './application/services/webhook.service';
import { ORDER_EVENT_PUBLISHER } from './application/port/event-publisher.port';
import { KafkaOrderEventPublisher } from './infrastructure/kafka/kafka-order-event-publisher';

@Module({
  imports: [KafkaModule.register(QUEUE_SERVICES.BFF)],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    {
      provide: ORDER_EVENT_PUBLISHER,
      useClass: KafkaOrderEventPublisher,
    },
  ],
})
export class WebhookModule {}
