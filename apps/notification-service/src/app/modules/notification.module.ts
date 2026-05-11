import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateNotificationHandler } from './application/commands/create-notification/create-notification.handler';
import { MarkReadHandler } from './application/commands/mark-read/mark-read.handler';
import { NotificationInfraModule } from './infrastructure/notification-infra.module';
import { NotificationController } from './presentation/controllers/notification.controller';

@Module({
  imports: [CqrsModule, TypeOrmProvider, NotificationInfraModule],
  controllers: [NotificationController],
  providers: [CreateNotificationHandler, MarkReadHandler],
  exports: [],
})
export class NotificationModule {}
