import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { INotificationCommandRepository } from '../../ports/repositories/notification-command.repo';
import { MarkAllAsReadCommand } from './mark-read-all.command';

@CommandHandler(MarkAllAsReadCommand)
export class MarkAllAsReadHandler implements ICommandHandler<MarkAllAsReadCommand> {
  constructor(private readonly notificationRepo: INotificationCommandRepository) {}

  async execute(command: MarkAllAsReadCommand) {
    await this.notificationRepo.markAllAsRead(command.receiverId);
  }
}
