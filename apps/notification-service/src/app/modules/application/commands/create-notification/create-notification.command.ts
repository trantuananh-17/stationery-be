import { ICommand } from '@nestjs/cqrs';
import { NotificationType } from '../../../domain/enums/notification-type.enum';

export class CreateNotificationCommand implements ICommand {
  constructor(
    public readonly receiverId: string,

    public readonly type: NotificationType,

    public readonly title: string,

    public readonly message: string,

    public readonly metadata?: Record<string, any>,
  ) {}
}
