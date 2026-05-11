import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CreateNotificationCommand } from './create-notification.command';
import { Notification } from '../../../domain/entities/notification.entity';
import { INotificationCommandRepository } from '../../ports/repositories/notification-command.repo';
import { INotificationRealtimePort } from '../../ports/realtime/notification-realtime.port';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    private readonly notificationRepo: INotificationCommandRepository,
    private readonly notificationRealtime: INotificationRealtimePort,
  ) {}

  async execute(command: CreateNotificationCommand) {
    const { receiverId, type, title, message, metadata } = command;
    const notification = Notification.create(receiverId, type, title, message, metadata);

    Logger.log(JSON.stringify(notification), 'CreateNotificationHandler');

    await this.notificationRepo.save(notification);

    this.notificationRealtime.emitCreated(notification);

    return {
      notificationId: notification.id,
    };
  }
}
