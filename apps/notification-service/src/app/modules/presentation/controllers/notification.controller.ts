import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { GrpcMethod } from '@nestjs/microservices';

import { CreateNotificationCommand } from '../../application/commands/create-notification/create-notification.command';

import { MarkReadCommand } from '../../application/commands/mark-read/mark-read.command';

import { MarkAllAsReadCommand } from '../../application/commands/mark-read-all/mark-read-all.command';

import { GetNotificationsQuery } from '../../application/queries/get-notifications/get-notifications.query';

import { GetUnreadCountQuery } from '../../application/queries/get-unread-count/get-unread-count.query';

import { NotificationType } from '../../domain/enums/notification-type.enum';

import { NotificationStatus } from '../../domain/enums/notification-status.enum';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create notification',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['receiverId', 'type', 'title', 'message'],
      properties: {
        receiverId: {
          type: 'string',

          example: 'admin_1',
        },
        type: {
          type: 'string',
          enum: Object.values(NotificationType),
          example: NotificationType.USER_REGISTERED,
        },
        title: {
          type: 'string',
          example: 'New user registered',
        },
        message: {
          type: 'string',
          example: 'John Doe joined the system',
        },
        metadata: {
          type: 'object',
          example: {
            userId: 'u_1',
          },
        },
      },
    },
  })
  async createNotification(@Body() body: any) {
    return this.commandBus.execute(
      new CreateNotificationCommand(
        body.receiverId,
        body.type,
        body.title,
        body.message,
        body.metadata,
      ),
    );
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark notification as read',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'notification_1',
  })
  async markAsRead(
    @Param('id')
    notificationId: string,
  ) {
    return this.commandBus.execute(new MarkReadCommand(notificationId));
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all notifications as read',
  })
  async markAllAsRead(
    @Body('receiverId')
    receiverId: string,
  ) {
    return this.commandBus.execute(new MarkAllAsReadCommand(receiverId));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get notifications',
  })
  async getNotifications(
    @Query('receiverId')
    receiverId: string,
    @Query('page')
    page = 1,
    @Query('limit')
    limit = 8,
    @Query('status')
    status?: NotificationStatus,
    @Query('type')
    type?: NotificationType,
  ) {
    return this.queryBus.execute(
      new GetNotificationsQuery(receiverId, Number(page), Number(limit), status, type),
    );
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get unread count',
  })
  async getUnreadCount(
    @Query('receiverId')
    receiverId: string,
  ) {
    return this.queryBus.execute(new GetUnreadCountQuery(receiverId));
  }

  @GrpcMethod('NotificationService', 'GetNotifications')
  async getNotificationsGrpc(payload: {
    receiverId: string;

    page: number;

    limit: number;

    status?: NotificationStatus;

    type?: NotificationType;
  }) {
    return this.queryBus.execute(
      new GetNotificationsQuery(
        payload.receiverId,
        payload.page,
        payload.limit,
        payload.status,
        payload.type,
      ),
    );
  }

  @GrpcMethod('NotificationService', 'GetUnreadCount')
  async getUnreadCountGrpc(payload: { receiverId: string }) {
    return this.queryBus.execute(new GetUnreadCountQuery(payload.receiverId));
  }

  @GrpcMethod('NotificationService', 'MarkAsRead')
  async markAsReadGrpc(payload: { notificationId: string }) {
    return this.commandBus.execute(new MarkReadCommand(payload.notificationId));
  }

  @GrpcMethod('NotificationService', 'MarkAllAsRead')
  async markAllAsReadGrpc(payload: { receiverId: string }) {
    return this.commandBus.execute(new MarkAllAsReadCommand(payload.receiverId));
  }
}
