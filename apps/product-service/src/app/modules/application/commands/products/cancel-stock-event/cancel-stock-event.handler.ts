import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IInventoryCommandRepository } from '../../../ports/repositories/inventory-command';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { IProcessedEventRepository } from '../../../ports/repositories/process-event.repo';
import { CancelStockEventCommand } from './cancel-stock-event.command';

@CommandHandler(CancelStockEventCommand)
export class CancelStockEventHandler implements ICommandHandler<CancelStockEventCommand> {
  constructor(
    private readonly processedEventRepo: IProcessedEventRepository,
    private readonly inventoryRepo: IInventoryCommandRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(command: CancelStockEventCommand): Promise<void> {
    const inserted = await this.processedEventRepo.tryInsert(command.eventId, 'ORDER_CANCELED');

    if (!inserted) {
      return;
    }

    await this.uow.runInTransaction(async () => {
      for (const item of command.items) {
        const ok = await this.inventoryRepo.releaseStockAtomic(item.variantId, item.quantity);

        if (!ok) {
          throw new Error(`Cancel stock failed for variant ${item.variantId}`);
        }
      }
    });
  }
}
