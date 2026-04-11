import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartInfraModule } from './infrastructure/cart-infras.module';
import { CartController } from './presentation/controllers/cart.controller';
import { AddToCartHandler } from './application/commands/add-to-cart/add-to-cart.handler';
import { UpdateQuantityHandler } from './application/commands/update-quantity/update-quantity.handler';
import { GetCartHandler } from './application/queries/get-cart/get-cart.handler';
import { GetCartCountHandler } from './application/queries/get-cart-count/get-cart-count.handler';
import { RemoveItemHandler } from './application/commands/remove-item/remove-item.handler';
import { ClearCartHandler } from './application/commands/clear-cart/clear-cart.handler';
import { MergeCartHandler } from './application/commands/merge-cart/merge-carthandler';
import { GetCartCheckoutHandler } from './application/queries/get-cart-checkout/get-cart-checkout.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, CartInfraModule],
  controllers: [CartController],
  providers: [
    AddToCartHandler,
    UpdateQuantityHandler,
    GetCartHandler,
    GetCartCountHandler,
    RemoveItemHandler,
    ClearCartHandler,
    MergeCartHandler,
    GetCartCheckoutHandler,
  ],
  exports: [],
})
export class CartModule {}
