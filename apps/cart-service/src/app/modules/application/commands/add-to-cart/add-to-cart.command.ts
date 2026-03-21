import { ICommand } from '@nestjs/cqrs';

export class AddToCartCommand implements ICommand {
  constructor(
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
