import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemCommand } from './remove-item.command';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';

@CommandHandler(RemoveItemCommand)
export class RemoveItemHandler implements ICommandHandler<RemoveItemCommand, void> {
  constructor(private readonly cartRepository: ICartCommandRepository) {}

  async execute(command: RemoveItemCommand): Promise<void> {
    const { cartItemId, userId, sessionId } = command;

    const cart = await this.cartRepository.findByCartItemId(cartItemId);

    if (!cart) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    if (userId) {
      if (cart.userId !== userId) {
        throw new ForbiddenException('Bạn không có quyền truy cập giỏ hàng này');
      }
    } else {
      if (!sessionId || cart.sessionId !== sessionId) {
        throw new ForbiddenException('Bạn không có quyền truy cập giỏ hàng này');
      }
    }

    cart.removeItem(cartItemId);
    await this.cartRepository.save(cart);
  }
}
