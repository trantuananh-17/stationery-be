import { ICommand } from '@nestjs/cqrs';

type CancelItemInput = {
  variantId: string;
  quantity: number;
};

export class CancelStockEventCommand implements ICommand {
  constructor(
    public readonly eventId: string,
    public readonly items: CancelItemInput[],
  ) {}
}
