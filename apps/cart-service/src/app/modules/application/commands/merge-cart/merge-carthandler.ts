import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MergeCartCommand } from './merge-cart.command';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';
import { Cart, AddCartItemParams } from '../../../domain/entities/cart.entity';

@CommandHandler(MergeCartCommand)
export class MergeCartHandler implements ICommandHandler<MergeCartCommand, void> {
  constructor(private readonly cartCommandRepository: ICartCommandRepository) {}

  async execute(command: MergeCartCommand): Promise<void> {
    const { userId, sessionId } = command;

    if (!userId) {
      throw new UnauthorizedException('Bạn cần đăng nhập để thực hiện chức năng này');
    }

    if (!sessionId) {
      return;
    }

    const sessionCart = await this.cartCommandRepository.findActiveBySessionId(sessionId);

    if (!sessionCart || !sessionCart.hasItems()) {
      return;
    }

    let userCart = await this.cartCommandRepository.findActiveByUserId(userId);

    if (!userCart) {
      userCart = Cart.create({
        userId,
        currency: sessionCart.currency,
      });
    }

    const itemsToMerge: AddCartItemParams[] = sessionCart.getItems().map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      productNameSnapshot: item.productNameSnapshot,
      productSlugSnapshot: item.productSlugSnapshot,
      variantNameSnapshot: item.variantNameSnapshot,
      skuSnapshot: item.skuSnapshot,
      productThumbnailSnapshot: item.productThumbnailSnapshot,
      imageVariantSnapshot: item.imageVariantSnapshot,
      unitPriceSnapshot: item.unitPriceSnapshot,
      compareAtPriceSnapshot: item.compareAtPriceSnapshot,
      attributesSnapshot: item.attributesSnapshot,
    }));

    userCart.mergeItems(itemsToMerge);

    sessionCart.clear();
    sessionCart.markMerged();

    await this.cartCommandRepository.save(userCart);
    await this.cartCommandRepository.save(sessionCart);
  }
}
