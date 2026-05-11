import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INotificationCommandRepository } from '../../ports/repositories/notification-command.repo';

import { MarkReadCommand } from './mark-read.command';
import { NotificationNotFoundError } from '../../../domain/errors/notification.error';

@CommandHandler(MarkReadCommand)
export class MarkReadHandler implements ICommandHandler<MarkReadCommand> {
  constructor(private readonly notificationCommandRepo: INotificationCommandRepository) {}

  async execute(command: MarkReadCommand) {
    const notification = await this.notificationCommandRepo.findById(command.notificationId);

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    notification.markAsRead();

    await this.notificationCommandRepo.save(notification);
  }
}
