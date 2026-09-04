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
import { GetProductsByAdminHandler } from './application/queries/get-products-admin/get-products-admin.handler';
import { GetInventoriesHandler } from './application/queries/get-inventories/get-inventories.handler';
import { AdjustStockHandler } from './application/commands/products/adjust-stock/adjust-stock.handler';
import { GetReviewsHandler } from './application/queries/get-reviews/get-reviews.handler';
import { CreateReviewHandler } from './application/commands/reviews/create-review/create-review.handler';
import { DeleteReviewHandler } from './application/commands/reviews/delete-review/delete-review.handler';
import { ConfirmStockEventHandler } from './application/commands/products/confirm-stock-event/confirm-stock-event.handler';
import { CancelStockEventHandler } from './application/commands/products/cancel-stock-event/cancel-stock-event.handler';
import { ReturnStockEventHandler } from './application/commands/products/return-stock-event/return-stock-event.handler';
import { GetProductAiHandler } from './application/queries/get-product-ai/get-product-ai.handler';
import { ProductAiController } from './presentation/controllers/product-ai.controller';
import { DeleteProductHandler } from './application/commands/products/delete-product/delete-product.handler';
import { RestoreProductHandler } from './application/commands/products/restore-product/restore-product.command';

@Module({
  imports: [CqrsModule, TypeOrmProvider, ProductInfraModule],
  controllers: [ProductController, ProductAiController],
  providers: [
    CreateProductHandler,
    UpdateProductHandler,
    GetProductsHandler,
    GetProductInfoHandler,
    GetFeaturedHandler,
    GetRelatedHandler,
    GetItemHandler,
    ReserveStockHandler,
    GetProductsByAdminHandler,
    GetInventoriesHandler,
    AdjustStockHandler,
    GetReviewsHandler,
    CreateReviewHandler,
    DeleteReviewHandler,
    ConfirmStockEventHandler,
    CancelStockEventHandler,
    ReturnStockEventHandler,
    GetProductAiHandler,
    DeleteProductHandler,
    RestoreProductHandler,
  ],
  exports: [],
})
export class ProductModule {}
