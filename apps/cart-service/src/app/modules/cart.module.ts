import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartInfraModule } from './infrastructure/cart-infras.module';
import { CartController } from './presentation/controllers/cart.controller';
import { AddToCartHandler } from './application/commands/add-to-cart/add-to-cart.handler';
import { UpdateQuantityHandler } from './application/commands/update-quantity/update-quantity.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, CartInfraModule],
  controllers: [CartController],
  providers: [AddToCartHandler, UpdateQuantityHandler],
  exports: [],
})
export class CartModule {}
