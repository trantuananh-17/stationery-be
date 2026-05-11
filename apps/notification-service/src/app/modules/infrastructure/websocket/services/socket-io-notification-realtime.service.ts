import { Injectable } from '@nestjs/common';

import { INotificationRealtimePort } from '../../../application/ports/realtime/notification-realtime.port';
import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class SocketIoNotificationRealtimeService implements INotificationRealtimePort {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  emitCreated(notification: Notification): void {
    this.notificationGateway.server.to(notification.receiverId).emit('notification.created', {
      id: notification.id,
      receiverId: notification.receiverId,
      type: notification.type,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    });
  }

  emitRead(notificationId: string, receiverId: string): void {
    this.notificationGateway.server.to(receiverId).emit('notification.read', {
      notificationId,
      receiverId,
    });
  }
}
