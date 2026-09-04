import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { INotificationGrpcService } from './notification-grpc.interface';
import { NotificationPort } from '../../application/ports/notification.port';
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
  GetUnreadCountRequest,
  GetUnreadCountResponse,
  MarkAllAsReadRequest,
  MarkAsReadRequest,
} from '../../application/ports/dtos/notification.dto';

@Injectable()
export class NotificationGrpcAdapter implements NotificationPort, OnModuleInit {
  private notificationService: INotificationGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.notificationService =
      this.notificationClient.getService<INotificationGrpcService>('NotificationService');
  }

  getNotifications(data: GetNotificationsRequest): Promise<GetNotificationsResponse> {
    return firstValueFrom(this.notificationService.getNotifications(data));
  }

  getUnreadCount(data: GetUnreadCountRequest): Promise<GetUnreadCountResponse> {
    return firstValueFrom(this.notificationService.getUnreadCount(data));
  }

  markAsRead(data: MarkAsReadRequest): Promise<void> {
    return firstValueFrom(this.notificationService.markAsRead(data));
  }

  markAllAsRead(data: MarkAllAsReadRequest): Promise<void> {
    return firstValueFrom(this.notificationService.markAllAsRead(data));
  }
}
