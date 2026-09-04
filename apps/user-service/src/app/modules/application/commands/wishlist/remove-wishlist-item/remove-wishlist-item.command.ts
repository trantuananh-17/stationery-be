import { ICommand } from '@nestjs/cqrs';

export class RemoveWishlistItemCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
  ) {}
}
