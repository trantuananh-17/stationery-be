import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateQuantityCommand } from './update-quantity.command';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { Cart } from '../../../domain/entities/cart.entity';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';
import { ICartQueryRepository } from '../../ports/repositories/cart-query.repo';

@CommandHandler(UpdateQuantityCommand)
export class UpdateQuantityHandler implements ICommandHandler<UpdateQuantityCommand> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: UpdateQuantityCommand): Promise<void> {
    const { variantId, quantity, userId, sessionId } = command;

    if (!userId && !sessionId) {
      throw new Error('userId or sessionId is required');
    }

    if (quantity < 0) {
      throw new Error('Quantity must be greater than or equal to 0');
    }

    return await this.dataContext.runInTransaction(async () => {
      let cart: Cart | null = null;

      if (userId) {
        cart = await this.cartQueryRepo.findByUserId(userId);
      } else if (sessionId) {
        cart = await this.cartQueryRepo.findBySessionId(sessionId);
      }

      if (!cart) {
        throw new Error('Cart not found');
      }

      const existedItem = cart.getItemByVariantId(variantId);

      if (!existedItem) {
        throw new Error('Cart item not found');
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
        throw new Error('Product not found');
      }

      if (productCartItem.stock <= 0) {
        throw new Error('Product is out of stock');
      }

      if (quantity > productCartItem.stock) {
        throw new Error(`Quantity exceeds stock. Available stock: ${productCartItem.stock}`);
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
