import { ICommand } from '@nestjs/cqrs';

export class RemoveItemCommand implements ICommand {
  constructor(
    public readonly cartItemId: string,
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
