import { Module } from '@nestjs/common';
import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { CartInfrasModule } from './infrastructure/cart-infra.module';
import { AddToCartUseCase } from './application/add-to-cart.usecase';
import { ClearCartUseCase } from './application/clear-cart.usecase';
import { GetCartUseCase } from './application/get-cart.usecase';
import { GetCartCountUseCase } from './application/get-cart-count.usecase';
import { GetCartForCheckoutUseCase } from './application/get-cart-for-checkout.usecase';
import { MergeCartUseCase } from './application/merge-cart.usecase';
import { UpdateCartItemQuantityUseCase } from './application/update-cart-item-quantity.usecase';
import { RemoveCartItemUseCase } from './application/remove-cart-item.usecase';
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
