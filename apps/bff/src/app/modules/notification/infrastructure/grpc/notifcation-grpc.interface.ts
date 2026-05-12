import { Observable } from 'rxjs';
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  GetUnreadCountRequest,
  GetUnreadCountResponse,
  MarkAllAsReadRequest,
  MarkAsReadRequest,
} from '../../applications/ports/dtos/notification.dto';

export interface INotificationGrpcService {
  getNotifications(data: GetNotificationsRequest): Observable<GetNotificationsResponse>;
  getUnreadCount(data: GetUnreadCountRequest): Observable<GetUnreadCountResponse>;

  markAsRead(data: MarkAsReadRequest): Observable<void>;

  markAllAsRead(data: MarkAllAsReadRequest): Observable<void>;
}
