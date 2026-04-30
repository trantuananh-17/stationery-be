import { Module } from '@nestjs/common';
import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { CartInfrasModule } from './infrastructure/cart-infra.module';
import { AddToCartUseCase } from './applications/add-to-cart.usecase';
import { ClearCartUseCase } from './applications/clear-cart.usecase';
import { GetCartUseCase } from './applications/get-cart.usecase';
import { GetCartCountUseCase } from './applications/get-cart-count.usecase';
import { GetCartForCheckoutUseCase } from './applications/get-cart-for-checkout.usecase';
import { MergeCartUseCase } from './applications/merge-cart.usecase';
import { UpdateCartItemQuantityUseCase } from './applications/update-cart-item-quantity.usecase';
import { RemoveCartItemUseCase } from './applications/remove-cart-item.usecase';
import { CartController } from './presentation/controllers/cart.controller';

@Module({
  imports: [CartInfrasModule, JwtProvider, GuardsModule],
  controllers: [CartController],
  providers: [
    AddToCartUseCase,
    ClearCartUseCase,
    GetCartUseCase,
    GetCartCountUseCase,
    GetCartForCheckoutUseCase,
    MergeCartUseCase,
    RemoveCartItemUseCase,
    UpdateCartItemQuantityUseCase,
  ],
  exports: [JwtProvider, GuardsModule],
})
export class CartModule {}
