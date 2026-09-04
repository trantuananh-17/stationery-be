import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  StockBelowReservedError,
  VariantNotFoundError,
} from '../../../../domain/errors/product.error';
import { IInventoryCommandRepository } from '../../../ports/repositories/inventory-command';
import { AdjustStockCommand } from './adjust-stock.command';

@CommandHandler(AdjustStockCommand)
export class AdjustStockHandler implements ICommandHandler<AdjustStockCommand> {
  constructor(private readonly inventoryRepo: IInventoryCommandRepository) {}

  async execute(command: AdjustStockCommand) {
    const { variantId, stock } = command;

    const variant = await this.inventoryRepo.findVariant(variantId);

    if (!variant) {
      throw new VariantNotFoundError(variantId);
    }

    // Không cho hạ tồn xuống dưới phần đang bị giữ cho đơn chưa xử lý xong,
    // nếu không saga confirm-stock sẽ thất bại và đơn đã đặt bị treo.
    if (stock < variant.reservedStock) {
      throw new StockBelowReservedError(variantId, stock, variant.reservedStock);
    }

    await this.inventoryRepo.setStock(variantId, stock);

    return {
      variantId,
      stock,
      reservedStock: variant.reservedStock,
    };
  }
}
