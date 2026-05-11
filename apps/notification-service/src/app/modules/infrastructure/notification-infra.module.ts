import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INotificationCommandRepository } from '../application/ports/repositories/notification-command.repo';
import { NotificationOrmEntity } from './entities/typeorm-notification.entity';
import { TypeOrmNotificationRepository } from './repositories/typeorm-notification-command.repo';
import { INotificationRealtimePort } from '../application/ports/realtime/notification-realtime.port';
import { SocketIoNotificationRealtimeService } from './websocket/services/socket-io-notification-realtime.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOrmEntity]), WebsocketModule],
  providers: [
    { provide: INotificationCommandRepository, useClass: TypeOrmNotificationRepository },
    {
      provide: INotificationRealtimePort,
      useClass: SocketIoNotificationRealtimeService,
    },
  ],
  exports: [INotificationCommandRepository, INotificationRealtimePort],
})
export class NotificationInfraModule {}
