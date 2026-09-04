import { Module } from '@nestjs/common';
import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';
import { ProductInfrasModule } from './infrastructure/product-infras.module';
import { ProductController } from './presentation/controllers/product.controller';
import { GetProductByIdUseCase } from './application/get-product-id.usecase';
import { GetProductsUseCase } from './application/get-products.usecase';
import { GetProductBySlugUseCase } from './application/get-product-slug.usecase';
import { CreateProductUseCase } from './application/create-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { GetProductsByAdminUseCase } from './application/get-products-admin.usecase';
import { AdminProductController } from './presentation/controllers/admin-product.controller';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { RestoreProductUseCase } from './application/restore-product.usecase';
import { GetInventoriesUseCase } from './application/get-inventories.usecase';
import { AdjustStockUseCase } from './application/adjust-stock.usecase';
import { InventoryController } from './presentation/controllers/inventory.controller';
import { ReviewController } from './presentation/controllers/review.controller';
import { GetReviewsUseCase } from './application/get-reviews.usecase';
import { CreateReviewUseCase } from './application/create-review.usecase';
import { DeleteReviewUseCase } from './application/delete-review.usecase';
import { UserModule } from '../user/user.module';
import { AiPort } from './application/ports/ai.port';
import { AiHttpAdapter } from './infrastructure/http/ai-http.adapter';
import { ProductDiscoveryController } from './presentation/controllers/product-discovery.controller';

@Module({
  imports: [ProductInfrasModule, JwtProvider, GuardsModule, UserModule],
  controllers: [
    ProductController,
    AdminProductController,
    InventoryController,
    ReviewController,
    ProductDiscoveryController,
  ],
  providers: [
    GetProductByIdUseCase,
    GetProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    GetProductsByAdminUseCase,
    DeleteProductUseCase,
    RestoreProductUseCase,
    GetInventoriesUseCase,
    AdjustStockUseCase,
    GetReviewsUseCase,
    CreateReviewUseCase,
    DeleteReviewUseCase,
    {
      provide: AiPort,
      useClass: AiHttpAdapter,
    },
  ],
  exports: [JwtProvider, GuardsModule],
})
export class ProductModule {}
