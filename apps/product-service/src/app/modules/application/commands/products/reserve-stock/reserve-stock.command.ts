import { ICommand } from '@nestjs/cqrs';

export type ReserveStockItemInput = {
  variantId: string;
  quantity: number;
};

export class ReserveStockCommand implements ICommand {
  constructor(public readonly items: ReserveStockItemInput[]) {}
}
