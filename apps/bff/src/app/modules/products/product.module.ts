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

@Module({
  imports: [ProductInfrasModule, JwtProvider, GuardsModule],
  controllers: [ProductController],
  providers: [
    GetProductByIdUseCase,
    GetProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
  ],
  exports: [JwtProvider, GuardsModule],
})
export class ProductModule {}
