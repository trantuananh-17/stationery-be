import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReserveStockCommand } from './reserve-stock.command';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { IInventoryCommandRepository } from '../../../ports/repositories/inventory-command';

export type ReserveStockItemResult = {
  variantId: string;
  requestedQuantity: number;
  success: boolean;
  status: 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';
  availableStock: number;
  remainingStock: number;
  message?: string;
};

export type ReserveStockResult = {
  success: boolean;
  items: ReserveStockItemResult[];
};

@CommandHandler(ReserveStockCommand)
export class ReserveStockHandler
  implements ICommandHandler<ReserveStockCommand, ReserveStockResult>
{
  constructor(
    private readonly inventoryCommandRepo: IInventoryCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: ReserveStockCommand): Promise<ReserveStockResult> {
    return await this.dataContext.runInTransaction(async () => {
      const mergedItems = this.mergeDuplicateItems(command.items);
      const variantIds = mergedItems.map((item) => item.variantId);

      const variants = await this.inventoryCommandRepo.findVariantsForUpdate(variantIds);

      const variantMap = new Map(variants.map((v) => [v.variantId, v]));
      const results: ReserveStockItemResult[] = [];

      let hasError = false;

      for (const item of mergedItems) {
        const variant = variantMap.get(item.variantId);

        if (!variant || variant.deletedAt) {
          hasError = true;

          results.push({
            variantId: item.variantId,
            requestedQuantity: item.quantity,
            success: false,
            status: 'not_found',
            availableStock: 0,
            remainingStock: 0,
            message: 'Variant not found',
          });

          continue;
        }

        const availableStock = Math.max(variant.stock - variant.reservedStock, 0);

        if (!variant.isAvailable) {
          hasError = true;

          results.push({
            variantId: item.variantId,
            requestedQuantity: item.quantity,
            success: false,
            status: 'inactive',
            availableStock,
            remainingStock: availableStock,
            message: 'Variant is inactive',
          });

          continue;
        }

        if (item.quantity <= 0) {
          hasError = true;

          results.push({
            variantId: item.variantId,
            requestedQuantity: item.quantity,
            success: false,
            status: 'invalid_quantity',
            availableStock,
            remainingStock: availableStock,
            message: 'Quantity must be greater than 0',
          });

          continue;
        }

        if (availableStock < item.quantity) {
          hasError = true;

          results.push({
            variantId: item.variantId,
            requestedQuantity: item.quantity,
            success: false,
            status: 'insufficient_stock',
            availableStock,
            remainingStock: availableStock,
            message: `Only ${availableStock} item(s) available`,
          });

          continue;
        }

        results.push({
          variantId: item.variantId,
          requestedQuantity: item.quantity,
          success: true,
          status: 'reserved',
          availableStock,
          remainingStock: availableStock - item.quantity,
        });
      }

      if (hasError) {
        return {
          success: false,
          items: results,
        };
      }

      for (const item of mergedItems) {
        await this.inventoryCommandRepo.reserveStock(item.variantId, item.quantity);
      }

      return {
        success: true,
        items: results,
      };
    });
  }

  private mergeDuplicateItems(
    items: { variantId: string; quantity: number }[],
  ): { variantId: string; quantity: number }[] {
    const map = new Map<string, number>();

    for (const item of items) {
      const current = map.get(item.variantId) ?? 0;
      map.set(item.variantId, current + item.quantity);
    }

    return Array.from(map.entries()).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    }));
  }
}
