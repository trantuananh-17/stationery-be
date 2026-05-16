// event-publisher.kafka.ts

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

  async emitCustomerCreated(payload: {
    eventId: string;
    customerId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  }): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('customer.created', payload));

    await this.emitNotificationCreated({
      eventId: crypto.randomUUID(),
      receiverId: 'e6d14eb9-268c-4a74-88b0-4b0d9731443b',
      type: 'USER_REGISTERED',
      title: 'Có khách hàng mới đăng ký',
      message: `${payload.firstName} ${payload.lastName} vừa tạo tài khoản mới với email ${payload.email}`,
      metadata: {
        customerId: payload.customerId,
        email: payload.email,
        fullName: `${payload.firstName} ${payload.lastName}`,
        sourceEventId: payload.eventId,
      },
      createdAt: new Date().toISOString(),
    });
  }

  async emitNotificationCreated(payload: {
    eventId: string;
    receiverId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }): Promise<void> {
    await firstValueFrom(this.kafkaService.emit('notification.create', payload));
  }
}
