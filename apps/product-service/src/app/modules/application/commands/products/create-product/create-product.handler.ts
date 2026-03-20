import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Product } from '../../../../domain/entities/product.entity';
import { IProductCommandRepository } from '../../../ports/repositories/product-command.repo';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { ISlugService } from '../../../ports/services/slug.port';
import { ICategoryQueryRepository } from '../../../ports/repositories/category-query.repo';
import { IBrandQueryRepository } from '../../../ports/repositories/brand-query.repo';
import { CategoryNotFoundError } from '../../../../domain/errors/category.error';
import { BrandNotFoundError } from '../../../../domain/errors/brand.error';
import { ISkuService } from '../../../ports/services/sku.port';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly productCommandRepo: IProductCommandRepository,
    private readonly categoryQueryRepo: ICategoryQueryRepository,
    private readonly brandQueryRepo: IBrandQueryRepository,
    private readonly dataContext: IUnitOfWork,
    private readonly slugService: ISlugService,
    private readonly skuService: ISkuService,
  ) {}

  async execute(command: CreateProductCommand) {
    return await this.dataContext.runInTransaction(async () => {
      const { product, specifications, variants } = command;

      const [category, brand] = await Promise.all([
        this.categoryQueryRepo.findCategoryExist(product.categoryId),
        this.brandQueryRepo.findBrandExist(product.brandId),
      ]);

      if (!category) {
        throw new CategoryNotFoundError();
      }

      if (!brand) {
        throw new BrandNotFoundError();
      }

      const slug = await this.slugService.generate(product.name);

      const productAggregate = Product.create({
        ...product,
        slug,
      });

      specifications?.forEach((spec) => {
        productAggregate.addSpecification({
          attributeId: spec.attributeId,
          value: spec.value,
        });
      });

      for (const variant of variants ?? []) {
        const sku = await this.skuService.generateVariantSku({
          productSlug: slug,
          attributeValueSlugs: variant.attributeValueSlug,
        });

        productAggregate.addVariant({
          name: variant.name,
          sku,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
          image: variant.image,
          isDefault: variant.isDefault,
          attributeValueIds: variant.attributeValueIds,
        });
      }

      await this.productCommandRepo.save(productAggregate);

      return productAggregate.id;
    });
  }
}
