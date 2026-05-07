import { ICommand } from '@nestjs/cqrs';

export type ItemInput = {
  variantId: string;
  quantity: number;
};

export class ReturnStockEventCommand implements ICommand {
  constructor(
    public readonly eventId: string,
    public readonly items: ItemInput[],
  ) {}
}
