import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/entities/typeorm-product.entity';
import { ProductController } from './presentation/controllers/product.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { IProductCommandRepository } from './application/ports/product-command.repo';
import { TypeOrmProductCommandRepository } from './infrastructure/repositories/typeorm-product-command.repo';
import { IProductQueryRepository } from './application/ports/product-query.repo';
import { TypeOrmProductQueryRepository } from './infrastructure/repositories/typeorm-product-query.repo';
import { CreateProductHandler } from './application/commands/handlers/create-product.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider, TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductController],
  providers: [
    CreateProductHandler,

    { provide: IProductCommandRepository, useClass: TypeOrmProductCommandRepository },
    {
      provide: IProductQueryRepository,
      useClass: TypeOrmProductQueryRepository,
    },
  ],
  exports: [],
})
export class ProductModule {}
