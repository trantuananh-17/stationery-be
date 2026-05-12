import { ICommand } from '@nestjs/cqrs';

export class MarkAllAsReadCommand implements ICommand {
  constructor(public readonly receiverId: string) {}
}
