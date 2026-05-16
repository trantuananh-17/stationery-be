import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateQuantityCommand } from './update-quantity.command';

import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';

import { Cart } from '../../../domain/entities/cart.entity';

import {
  CartItemNotFoundError,
  CartNotFoundError,
  CartUserOrSessionRequiredError,
  InvalidCartItemQuantityError,
  ProductNotFoundInCartError,
  ProductOutOfStockError,
  QuantityExceedsStockError,
} from '../../../domain/errors/cart.error';

@CommandHandler(UpdateQuantityCommand)
export class UpdateQuantityHandler implements ICommandHandler<UpdateQuantityCommand> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: UpdateQuantityCommand): Promise<void> {
    const { variantId, quantity, userId, sessionId } = command;

    if (!userId && !sessionId) {
      throw new CartUserOrSessionRequiredError();
    }

    if (quantity < 0) {
      throw new InvalidCartItemQuantityError();
    }

    return await this.dataContext.runInTransaction(async () => {
      let cart: Cart | null = null;

      if (userId) {
        cart = await this.cartCommandRepo.findActiveByUserId(userId);
      } else if (sessionId) {
        cart = await this.cartCommandRepo.findActiveBySessionId(sessionId);
      }

      if (!cart) {
        throw new CartNotFoundError();
      }

      const existedItem = cart.getItemByVariantId(variantId);

      if (!existedItem) {
        throw new CartItemNotFoundError();
      }

      if (quantity === 0) {
        cart.removeItem(existedItem.id);

        await this.cartCommandRepo.save(cart);

        return;
      }

      const productCartItem = await this.productGrpcPort.getProductCartItem({
        variantId,
      });

      if (!productCartItem) {
        throw new ProductNotFoundInCartError();
      }

      if (productCartItem.stock <= 0) {
        throw new ProductOutOfStockError();
      }

      if (quantity > productCartItem.stock) {
        throw new QuantityExceedsStockError();
      }

      cart.updateItemQuantity(existedItem.id, quantity);

      cart.updateItemSnapshot(existedItem.id, {
        productNameSnapshot: productCartItem.productName,
        productSlugSnapshot: productCartItem.productSlug,
        variantNameSnapshot: productCartItem.variantName,
        skuSnapshot: productCartItem.sku,
        productThumbnailSnapshot: productCartItem.productThumbnail,
        imageVariantSnapshot: productCartItem.imageVariant,
        unitPriceSnapshot: productCartItem.price,
        compareAtPriceSnapshot: productCartItem.compareAtPrice,
        attributesSnapshot: productCartItem.attributes.map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
      });

      await this.cartCommandRepo.save(cart);
    });
  }
}
