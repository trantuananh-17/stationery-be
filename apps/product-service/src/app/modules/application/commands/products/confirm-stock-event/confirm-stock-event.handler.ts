import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IInventoryCommandRepository } from '../../../ports/repositories/inventory-command';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { IProcessedEventRepository } from '../../../ports/repositories/process-event.repo';
import { ConfirmStockEventCommand } from './confirm-stock-event.command';
import { ConfirmStockFailedError } from '../../../../domain/errors/product.error';

@CommandHandler(ConfirmStockEventCommand)
export class ConfirmStockEventHandler implements ICommandHandler<ConfirmStockEventCommand> {
  constructor(
    private readonly processedEventRepo: IProcessedEventRepository,
    private readonly inventoryRepo: IInventoryCommandRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(command: ConfirmStockEventCommand): Promise<void> {
    await this.uow.runInTransaction(async () => {
      const inserted = await this.processedEventRepo.tryInsert(command.eventId, 'ORDER_CONFIRMED');

      if (!inserted) {
        return;
      }

      for (const item of command.items) {
        const ok = await this.inventoryRepo.confirmStockAtomic(item.variantId, item.quantity);

        if (!ok) {
          throw new ConfirmStockFailedError(item.variantId);
        }
      }
    });
  }
}
