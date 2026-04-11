export type ReserveStockItemInput = {
  variantId: string;
  quantity: number;
};

export class ReserveStockCommand {
  constructor(public readonly items: ReserveStockItemInput[]) {}
}
