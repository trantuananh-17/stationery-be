import { Notification } from '../../../domain/entities/notification.entity';

export abstract class INotificationCommandRepository {
  abstract save(notification: Notification): Promise<void>;
  abstract findById(id: string): Promise<Notification | null>;
  abstract markAllAsRead(receiverId: string): Promise<void>;
}
