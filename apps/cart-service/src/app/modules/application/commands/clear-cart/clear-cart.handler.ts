// application/commands/clear-cart/clear-cart.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClearCartCommand } from './clear-cart.command';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';

@CommandHandler(ClearCartCommand)
export class ClearCartHandler implements ICommandHandler<ClearCartCommand, void> {
  constructor(private readonly cartCommandRepository: ICartCommandRepository) {}

  async execute(command: ClearCartCommand): Promise<void> {
    const { userId, sessionId } = command;

    let cart = null;

    if (userId) {
      cart = await this.cartCommandRepository.findActiveByUserId(userId);
    } else if (sessionId) {
      cart = await this.cartCommandRepository.findActiveBySessionId(sessionId);
    }

    if (!cart) {
      return;
    }

    cart.clear();

    await this.cartCommandRepository.save(cart);
  }
}
