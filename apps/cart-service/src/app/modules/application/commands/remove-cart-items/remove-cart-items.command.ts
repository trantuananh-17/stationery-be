import { ICommand } from '@nestjs/cqrs';

export class RemoveCartItemsCommand implements ICommand {
  constructor(
    public readonly cartItemIds: string[],
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
