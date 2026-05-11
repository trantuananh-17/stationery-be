import { Module } from '@nestjs/common';

import { NotificationGateway } from './gateways/notification.gateway';

import { SocketIoNotificationRealtimeService } from './services/socket-io-notification-realtime.service';

@Module({
  providers: [NotificationGateway, SocketIoNotificationRealtimeService],

  exports: [NotificationGateway, SocketIoNotificationRealtimeService],
})
export class WebsocketModule {}
