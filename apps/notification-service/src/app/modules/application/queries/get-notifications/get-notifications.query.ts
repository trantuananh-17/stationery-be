import { IQuery } from '@nestjs/cqrs';

import { NotificationStatus } from '../../../domain/enums/notification-status.enum';

import { NotificationType } from '../../../domain/enums/notification-type.enum';

export class GetNotificationsQuery implements IQuery {
  constructor(
    public readonly receiverId: string,
    public readonly page = 1,
    public readonly limit = 8,
    public readonly status?: NotificationStatus,
    public readonly type?: NotificationType,
  ) {}
}
