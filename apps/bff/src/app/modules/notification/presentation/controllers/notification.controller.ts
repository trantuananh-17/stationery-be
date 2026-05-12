import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

import { UserData } from '@common/decorators/user-data.decorator';

import { ResponseDto } from '@common/interfaces/gateway/response.interface';

import { GetNotificationsDto } from '../dtos/get-notifications.dto';
import { NotificationPort } from '../../applications/ports/notification.port';
import {
  GetNotificationsResponse,
  GetUnreadCountResponse,
} from '../../applications/ports/dtos/notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationPort: NotificationPort) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get notifications for current user',
  })
  @ApiOkResponse({
    type: ResponseDto<GetNotificationsResponse>,
  })
  getNotifications(
    @UserData('userId')
    userId: string,

    @Query()
    query: GetNotificationsDto,
  ) {
    Logger.log(`Get notifications query: ${JSON.stringify(query)}`);

    return this.notificationPort.getNotifications({
      receiverId: userId,
      page: query.page,
      limit: query.limit,
      status: query.status,
      type: query.type,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  @ApiOperation({
    summary: 'Get unread notification count',
  })
  @ApiOkResponse({
    type: ResponseDto<GetUnreadCountResponse>,
  })
  getUnreadCount(
    @UserData('userId')
    userId: string,
  ) {
    Logger.log(`Get unread count userId: ${userId}`);

    return this.notificationPort.getUnreadCount({
      receiverId: userId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':notificationId/read')
  @ApiOperation({
    summary: 'Mark notification as read',
  })
  @ApiParam({
    name: 'notificationId',
    type: String,
    format: 'uuid',
  })
  markAsRead(
    @Param('notificationId', new ParseUUIDPipe())
    notificationId: string,
  ) {
    Logger.log(`Mark notification as read: ${notificationId}`);

    return this.notificationPort.markAsRead({
      notificationId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  @ApiOperation({
    summary: 'Mark all notifications as read',
  })
  markAllAsRead(
    @UserData('userId')
    userId: string,
  ) {
    Logger.log(`Mark all notifications as read userId: ${userId}`);

    return this.notificationPort.markAllAsRead({
      receiverId: userId,
    });
  }
}
