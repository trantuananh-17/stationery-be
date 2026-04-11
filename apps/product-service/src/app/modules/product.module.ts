import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './application/commands/products/create-product/create-product.handler';
import { UpdateProductHandler } from './application/commands/products/update-product/update-product.handler';
import { ProductInfraModule } from './infrastructure/product-infra.module';
import { ProductController } from './presentation/controllers/product.controller';
import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { GetProductInfoHandler } from './application/queries/get-product-id/get-product-info.handler';
import { GetFeaturedHandler } from './application/queries/get-featured/get-featured.handler';
import { GetRelatedHandler } from './application/queries/get-related/get-related.handler';
import { GetItemHandler } from './application/queries/get-item/get-item.handler';
import { ReserveStockHandler } from './application/commands/products/reserve-stock/reserve-stock.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, ProductInfraModule],
  controllers: [ProductController],
  providers: [
    CreateProductHandler,
    UpdateProductHandler,
    GetProductsHandler,
    GetProductInfoHandler,
    GetFeaturedHandler,
    GetRelatedHandler,
    GetItemHandler,
    ReserveStockHandler,
  ],
  exports: [],
})
export class ProductModule {}
