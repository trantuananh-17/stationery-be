import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUnreadCountQuery } from './get-unread-count.query';
import { INotificationQueryRepository } from '../../ports/repositories/notification-query.repo';

@QueryHandler(GetUnreadCountQuery)
export class GetUnreadCountHandler implements IQueryHandler<GetUnreadCountQuery> {
  constructor(private readonly notificationQueryRepo: INotificationQueryRepository) {}

  async execute(query: GetUnreadCountQuery) {
    const count = await this.notificationQueryRepo.getUnreadCount(query.receiverId);

    return {
      count,
    };
  }
}
