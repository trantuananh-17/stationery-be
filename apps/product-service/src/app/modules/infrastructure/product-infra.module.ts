import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductOrmEntity } from './entities/typeorm-product.entity';
import { SpecificationOrmEntity } from './entities/typeorm-specification.enity';
import { VariantAttributeOrmEntity } from './entities/typeorm-variant-attribute.entity';
import { VariantOrmEntity } from './entities/typeorm-variant.entity';
import { IProductCommandRepository } from '../application/ports/repositories/product-command.repo';
import { TypeOrmProductCommandRepository } from './repositories/typeorm-product-command.repo';
import { IProductQueryRepository } from '../application/ports/repositories/product-query.repo';
import { TypeOrmProductQueryRepository } from './repositories/typeorm-product-query.repo';
import { ISlugService } from '../application/ports/services/slug.port';
import { SlugService } from './services/slug.service';
import { IUnitOfWork } from '../application/ports/services/unit-of-work.port';
import { TypeOrmUnitOfWork } from './services/unit-of-work.service';
import { ISkuService } from '../application/ports/services/sku.port';
import { SkuService } from './services/sku.service';
import { ICategoryQueryRepository } from '../application/ports/repositories/category-query.repo';
import { TypeOrmCategoryQueryRepository } from './repositories/typorm-category-query.repo';
import { CategoryOrmEntity } from './entities/typeorm-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductOrmEntity,
      SpecificationOrmEntity,
      VariantAttributeOrmEntity,
      VariantOrmEntity,
      CategoryOrmEntity,
    ]),
  ],
  providers: [
    { provide: IProductCommandRepository, useClass: TypeOrmProductCommandRepository },
    {
      provide: IProductQueryRepository,
      useClass: TypeOrmProductQueryRepository,
    },
    {
      provide: ICategoryQueryRepository,
      useClass: TypeOrmCategoryQueryRepository,
    },
    {
      provide: ISlugService,
      useClass: SlugService,
    },
    {
      provide: IUnitOfWork,
      useClass: TypeOrmUnitOfWork,
    },
    {
      provide: ISkuService,
      useClass: SkuService,
    },
  ],
  exports: [
    IProductCommandRepository,
    IProductQueryRepository,
    ICategoryQueryRepository,
    ISlugService,
    IUnitOfWork,
    ISkuService,
  ],
})
export class ProductInfraModule {}
