import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationHandler } from './application/commands/create-notification/create-notification.handler';
import { MarkReadHandler } from './application/commands/mark-read/mark-read.handler';
import { NotificationInfraModule } from './infrastructure/notification-infra.module';
import { NotificationController } from './presentation/controllers/notification.controller';
import { GetNotificationsHandler } from './application/queries/get-notifications/get-notifications.handler';
import { GetUnreadCountHandler } from './application/queries/get-unread-count/get-unread-count.handler';
import { MarkAllAsReadHandler } from './application/commands/mark-read-all/mark-read-all.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, NotificationInfraModule],
  controllers: [NotificationController],
  providers: [
    CreateNotificationHandler,
    MarkReadHandler,
    MarkAllAsReadHandler,
    GetNotificationsHandler,
    GetUnreadCountHandler,
  ],
  exports: [],
})
export class NotificationModule {}
