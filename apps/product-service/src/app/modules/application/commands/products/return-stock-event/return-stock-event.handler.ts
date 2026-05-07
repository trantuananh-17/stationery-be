import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IInventoryCommandRepository } from '../../../ports/repositories/inventory-command';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { IProcessedEventRepository } from '../../../ports/repositories/process-event.repo';
import { ReturnStockEventCommand } from './return-stock-event.command';

@CommandHandler(ReturnStockEventCommand)
export class ReturnStockEventHandler implements ICommandHandler<ReturnStockEventCommand> {
  constructor(
    private readonly processedEventRepo: IProcessedEventRepository,
    private readonly inventoryRepo: IInventoryCommandRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(command: ReturnStockEventCommand): Promise<void> {
    const inserted = await this.processedEventRepo.tryInsert(command.eventId, 'ORDER_RETURNED');

    if (!inserted) {
      return;
    }

    await this.uow.runInTransaction(async () => {
      for (const item of command.items) {
        const ok = await this.inventoryRepo.restockAtomic(item.variantId, item.quantity);

        if (!ok) {
          throw new Error(`Confirm stock failed for variant ${item.variantId}`);
        }
      }
    });
  }
}
