import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { IProductCommandRepository } from '../../../ports/repositories/product-command.repo';
import { ICategoryQueryRepository } from '../../../ports/repositories/category-query.repo';
import { IUnitOfWork } from '../../../ports/services/unit-of-work.port';
import { ISkuService } from '../../../ports/services/sku.port';
import { ISlugService } from '../../../ports/services/slug.port';
import { IProductQueryRepository } from '../../../ports/repositories/product-query.repo';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly productCommandRepo: IProductCommandRepository,
    private readonly productQueryRepo: IProductQueryRepository,
    private readonly categoryQueryRepo: ICategoryQueryRepository,
    // private readonly brandQueryRepo: IBrandQueryRepository,
    private readonly dataContext: IUnitOfWork,
    private readonly slugService: ISlugService,
    private readonly skuService: ISkuService,
  ) {}

  async execute(command: UpdateProductCommand): Promise<{ productId: string }> {
    return await this.dataContext.runInTransaction(async () => {
      const { productId, product, specifications, variants } = command;

      const productAggregate = await this.productQueryRepo.findById(productId);

      if (!productAggregate) {
        // throw new ProductNotFoundError();
      }
      let slug: string | undefined;

      if (product.name !== undefined && product.name.trim() !== productAggregate.name) {
        slug = await this.slugService.generate(product.name);
      }

      productAggregate.updateProductInfo({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        slug,
        images: product.images,
        thumbnail: product.thumbnail,
        featured: product.featured,
        searchKeywords: product.searchKeywords,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
      });

      if (specifications !== undefined) {
        productAggregate.syncSpecifications(specifications);
      }

      if (variants !== undefined) {
        const variantInputs = await Promise.all(
          variants.map(async (variant, index) => {
            const sku = variant.id
              ? undefined
              : await this.skuService.generateVariantSku({
                  productSlug: productAggregate.slug,
                  attributeValueSlugs: variant.attributeValueSlug,
                });

            return {
              id: variant.id,
              name: variant.name,
              sku,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              stock: variant.stock,
              image: variant.image,
              sortOrder: variant.sortOrder ?? index,
              isDefault: variant.isDefault,
              attributeValueIds: variant.attributeValueIds,
            };
          }),
        );

        productAggregate.syncVariants(variantInputs);
      }

      await this.productCommandRepo.update(productAggregate);

      return { productId: productAggregate.id };
    });
  }
}
