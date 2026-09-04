import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  GetUnreadCountRequest,
  GetUnreadCountResponse,
  MarkAllAsReadRequest,
  MarkAsReadRequest,
} from './dtos/notification.dto';

export abstract class NotificationPort {
  abstract getNotifications(data: GetNotificationsRequest): Promise<GetNotificationsResponse>;

  abstract getUnreadCount(data: GetUnreadCountRequest): Promise<GetUnreadCountResponse>;

  abstract markAsRead(data: MarkAsReadRequest): Promise<void>;

  abstract markAllAsRead(data: MarkAllAsReadRequest): Promise<void>;
}
