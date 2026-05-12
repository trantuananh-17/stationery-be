import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationStatus } from '../../../domain/enums/notification-status.enum';
import { NotificationType } from '../../../domain/enums/notification-type.enum';

export abstract class INotificationQueryRepository {
  abstract getNotifications(params: {
    receiverId: string;
    page: number;
    limit: number;
    status?: NotificationStatus;
    type?: NotificationType;
  }): Promise<{
    items: Notification[];

    total: number;
  }>;

  abstract getUnreadCount(receiverId: string): Promise<number>;
}
