import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/product.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './application/commands/products/create-product.command.ts/create-product.handler';
import { ProductInfraModule } from './infrastructure/product-infra.module';

@Module({
  imports: [CqrsModule, TypeOrmProvider, ProductInfraModule],
  controllers: [ProductController],
  providers: [CreateProductHandler],
  exports: [],
})
export class ProductModule {}
