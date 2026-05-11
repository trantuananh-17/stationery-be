import { ICommand } from '@nestjs/cqrs';

export class MarkReadCommand implements ICommand {
  constructor(public readonly notificationId: string) {}
}
