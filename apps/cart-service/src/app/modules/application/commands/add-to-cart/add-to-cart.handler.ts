import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddToCartCommand } from './add-to-cart.command';
import { IProductGrpcPort } from '../../ports/grpc/product-grpc.port';
import { IUnitOfWork } from '../../ports/services/unit-of-work.port';
import { Cart } from '../../../domain/entities/cart.entity';
import { ICartCommandRepository } from '../../ports/repositories/cart-command.repo';
import { ICartQueryRepository } from '../../ports/repositories/cart-query.repo';

@CommandHandler(AddToCartCommand)
export class AddToCartHandler implements ICommandHandler<AddToCartCommand> {
  constructor(
    private readonly productGrpcPort: IProductGrpcPort,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly dataContext: IUnitOfWork,
  ) {}

  async execute(command: AddToCartCommand): Promise<void> {
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
        cart = Cart.create({
          userId,
          sessionId: userId ? undefined : sessionId,
          currency: 'VND',
        });
      }

      const existedItem = cart.getItemByVariantId(variantId);

      const productCartItem = await this.productGrpcPort.getProductCartItem({
        variantId,
      });

      if (!productCartItem) {
        throw new Error('Not Found');
      }

      if (productCartItem.stock <= 0) {
        throw new Error('Product is out of stock');
      }

      if (existedItem) {
        const nextQuantity = existedItem.quantity + quantity;

        if (nextQuantity > productCartItem.stock) {
          throw new Error(`Quantity exceeds stock. Available stock: ${productCartItem.stock}`);
        }

        existedItem.increaseQuantity(quantity);

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
      } else {
        cart.addItem({
          productId: productCartItem.productId,
          variantId: productCartItem.variantId,
          quantity,
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
      }

      await this.cartCommandRepo.save(cart);
    });
  }
}
