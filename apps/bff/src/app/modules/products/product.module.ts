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

@Module({
  imports: [ProductInfrasModule, JwtProvider, GuardsModule],
  controllers: [ProductController, AdminProductController],
  providers: [
    GetProductByIdUseCase,
    GetProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    GetProductsByAdminUseCase,
    DeleteProductUseCase,
    RestoreProductUseCase,
  ],
  exports: [JwtProvider, GuardsModule],
})
export class ProductModule {}
