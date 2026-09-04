import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './entities/typeorm-product.entity';
import { SpecificationOrmEntity } from './entities/typeorm-specification.entity';
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
import { TypeOrmCategoryQueryRepository } from './repositories/typeorm-category-query.repo';
import { CategoryOrmEntity } from './entities/typeorm-category.entity';
import { AttributeOrmEntity } from './entities/typeorm-attribute.entity';
import { AttributeValueOrmEntity } from './entities/typeorm-attribute-value.entity';
import { IBrandQueryRepository } from '../application/ports/repositories/brand-query.repo';
import { TypeOrmBrandQueryRepository } from './repositories/typeorm-brand-query.repo';
import { BrandOrmEntity } from './entities/typeorm-brand.entity';
import { IInventoryCommandRepository } from '../application/ports/repositories/inventory-command';
import { IInventoryQueryRepository } from '../application/ports/repositories/inventory-query.repo';
import { TypeOrmInventoryQueryRepository } from './repositories/typeorm-inventory-query.repo';
import { ReviewOrmEntity } from './entities/typeorm-review.entity';
import { IReviewCommandRepository } from '../application/ports/repositories/review-command.repo';
import { IReviewQueryRepository } from '../application/ports/repositories/review-query.repo';
import { TypeOrmReviewCommandRepository } from './repositories/typeorm-review.command.repo';
import { TypeOrmReviewQueryRepository } from './repositories/typeorm-review.query.repo';
import { TypeOrmInventoryCommandRepository } from './repositories/typeorm-inventory-command.repo';
import { IProcessedEventRepository } from '../application/ports/repositories/process-event.repo';
import { TypeOrmProcessedEventRepository } from './repositories/typeorm-process-event.repo';
import { InventoryProcessedEventEntity } from './entities/typeorm-process-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductOrmEntity,
      SpecificationOrmEntity,
      VariantAttributeOrmEntity,
      VariantOrmEntity,
      CategoryOrmEntity,
      AttributeOrmEntity,
      AttributeValueOrmEntity,
      BrandOrmEntity,
      InventoryProcessedEventEntity,
      ReviewOrmEntity,
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
      provide: IBrandQueryRepository,
      useClass: TypeOrmBrandQueryRepository,
    },
    {
      provide: IReviewCommandRepository,
      useClass: TypeOrmReviewCommandRepository,
    },
    {
      provide: IReviewQueryRepository,
      useClass: TypeOrmReviewQueryRepository,
    },
    {
      provide: IInventoryQueryRepository,
      useClass: TypeOrmInventoryQueryRepository,
    },
    {
      provide: IInventoryCommandRepository,
      useClass: TypeOrmInventoryCommandRepository,
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
    {
      provide: IProcessedEventRepository,
      useClass: TypeOrmProcessedEventRepository,
    },
  ],
  exports: [
    IProductCommandRepository,
    IProductQueryRepository,
    ICategoryQueryRepository,
    IBrandQueryRepository,
    IInventoryCommandRepository,
    IInventoryQueryRepository,
    IReviewCommandRepository,
    IReviewQueryRepository,
    IProcessedEventRepository,
    ISlugService,
    IUnitOfWork,
    ISkuService,
  ],
})
export class ProductInfraModule {}
