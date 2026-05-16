import { ICommand } from '@nestjs/cqrs';

export class CheckoutCartCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
