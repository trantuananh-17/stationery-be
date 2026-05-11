import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateNotificationCommand } from '../../application/commands/create-notification/create-notification.command';

import { NotificationType } from '../../domain/enums/notification-type.enum';
import { MarkReadCommand } from '../../application/commands/mark-read/mark-read.command';

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
    const data = await this.commandBus.execute(
      new CreateNotificationCommand(
        body.receiverId,
        body.type,
        body.title,
        body.message,
        body.metadata,
      ),
    );

    return {
      data,
      message: 'Create Notification Successfully',
      statusCode: HttpStatus.CREATED,
    };
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
  async markAsRead(@Param('id') notificationId: string) {
    await this.commandBus.execute(new MarkReadCommand(notificationId));

    return {
      message: 'Mark Notification As Read Successfully',

      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get notification by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'notification_1',
  })
  async getNotificationById(@Param('id') notificationId: string) {
    const data = await this.queryBus.execute({
      notificationId,
    });

    return {
      data,
      message: 'Get Notification Successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
