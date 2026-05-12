import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INotificationCommandRepository } from '../application/ports/repositories/notification-command.repo';
import { NotificationOrmEntity } from './entities/typeorm-notification.entity';
import { INotificationRealtimePort } from '../application/ports/realtime/notification-realtime.port';
import { SocketIoNotificationRealtimeService } from './websocket/services/socket-io-notification-realtime.service';
import { WebsocketModule } from './websocket/websocket.module';
import { TypeOrmNotificationCommandRepository } from './repositories/typeorm-notification-command.repo';
import { INotificationQueryRepository } from '../application/ports/repositories/notification-query.repo';
import { TypeOrmNotificationQueryRepository } from './repositories/typeorm-notification-query.repo';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOrmEntity]), WebsocketModule],
  providers: [
    { provide: INotificationCommandRepository, useClass: TypeOrmNotificationCommandRepository },
    { provide: INotificationQueryRepository, useClass: TypeOrmNotificationQueryRepository },
    {
      provide: INotificationRealtimePort,
      useClass: SocketIoNotificationRealtimeService,
    },
  ],
  exports: [
    INotificationCommandRepository,
    INotificationQueryRepository,
    INotificationRealtimePort,
  ],
})
export class NotificationInfraModule {}
