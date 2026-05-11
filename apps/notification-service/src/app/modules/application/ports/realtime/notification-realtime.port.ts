import { Notification } from '../../../domain/entities/notification.entity';

export abstract class INotificationRealtimePort {
  abstract emitCreated(notification: Notification): void;

  abstract emitRead(notificationId: string, receiverId: string): void;
}
