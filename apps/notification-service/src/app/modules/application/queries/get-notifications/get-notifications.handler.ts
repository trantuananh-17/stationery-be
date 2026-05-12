import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { toTimestamp } from '@common/utils/common.util';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationsQuery } from './get-notifications.query';
import { INotificationQueryRepository } from '../../ports/repositories/notification-query.repo';

export type NotificationGrpcDto = {
  id: string;
  receiverId: string;
  type: string;
  status: string;
  title: string;
  message: string;
  metadata?: Record<string, string>;
  createdAt: GrpcTimestamp;
  updatedAt: GrpcTimestamp;
  readAt?: GrpcTimestamp | null;
};

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
  constructor(private readonly notificationQueryRepo: INotificationQueryRepository) {}

  async execute(query: GetNotificationsQuery) {
    const result = await this.notificationQueryRepo.getNotifications({
      receiverId: query.receiverId,
      page: query.page,
      limit: query.limit,
      status: query.status,
      type: query.type,
    });
    return {
      items: result.items.map(
        (notification): NotificationGrpcDto => ({
          id: notification.id,
          receiverId: notification.receiverId,
          type: notification.type,
          status: notification.status,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata as Record<string, string>,
          createdAt: toTimestamp(notification.createdAt) as GrpcTimestamp,
          updatedAt: toTimestamp(notification.updatedAt) as GrpcTimestamp,
          readAt: notification.readAt ? (toTimestamp(notification.readAt) as GrpcTimestamp) : null,
        }),
      ),
      total: result.total,
    };
  }
}
