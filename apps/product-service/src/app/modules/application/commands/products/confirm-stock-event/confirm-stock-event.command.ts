import { ICommand } from '@nestjs/cqrs';

export type ItemInput = {
  variantId: string;
  quantity: number;
};

export class ConfirmStockEventCommand implements ICommand {
  constructor(
    public readonly eventId: string,
    public readonly items: ItemInput[],
  ) {}
}
