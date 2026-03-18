import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './application/commands/products/create-product/create-product.handler';
import { UpdateProductHandler } from './application/commands/products/update-product/update-product.handler';
import { ProductInfraModule } from './infrastructure/product-infra.module';
import { ProductController } from './presentation/controllers/product.controller';

@Module({
  imports: [CqrsModule, TypeOrmProvider, ProductInfraModule],
  controllers: [ProductController],
  providers: [CreateProductHandler, UpdateProductHandler],
  exports: [],
})
export class ProductModule {}
