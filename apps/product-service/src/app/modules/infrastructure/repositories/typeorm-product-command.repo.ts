import { Injectable } from '@nestjs/common';
import { IProductCommandRepository } from '../../application/ports/repositories/product-command.repo';
import { Product } from '../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';
import { SpecificationOrmEntity } from '../entities/typeorm-specification.enity';
import { VariantAttributeOrmEntity } from '../entities/typeorm-variant-attribute.entity';
import { Variant } from '../../domain/entities/variant.entity';
import { Specification } from '../../domain/entities/specification.entity';
import { VariantAttribute } from '../../domain/entities/variant-attribute.entity';
import { getManager } from '../helpers/get-manager.helper';

@Injectable()
export class TypeOrmProductCommandRepository implements IProductCommandRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,

    @InjectRepository(VariantOrmEntity)
    private readonly variantRepo: Repository<VariantOrmEntity>,

    @InjectRepository(SpecificationOrmEntity)
    private readonly specRepo: Repository<SpecificationOrmEntity>,

    @InjectRepository(VariantAttributeOrmEntity)
    private readonly attrRepo: Repository<VariantAttributeOrmEntity>,
  ) {}

  async save(product: Product): Promise<void> {
    const manager = getManager();

    const productRepo = manager ? manager.getRepository(ProductOrmEntity) : this.repo;
    const variantRepo = manager ? manager.getRepository(VariantOrmEntity) : this.variantRepo;
    const specRepo = manager ? manager.getRepository(SpecificationOrmEntity) : this.specRepo;
    const attrRepo = manager ? manager.getRepository(VariantAttributeOrmEntity) : this.attrRepo;

    const productOrm = this._toProductOrm(product);

    const variants = product.getVariants();
    const specs = product.getSpecifications();

    const variantOrms = variants.map((v) => this._toVariantOrm(v));
    const specOrms = specs.map((s) => this._toSpecOrm(s));

    const attrOrms = variants.flatMap((v) =>
      v.getAttributes().map((attr) => this._toAttrOrm(attr)),
    );

    await productRepo.save(productOrm);
    await variantRepo.save(variantOrms);
    await specRepo.save(specOrms);
    await attrRepo.save(attrOrms);
  }

  async update(product: Product): Promise<void> {
    const manager = getManager();

    const productRepo = manager ? manager.getRepository(ProductOrmEntity) : this.repo;
    const variantRepo = manager ? manager.getRepository(VariantOrmEntity) : this.variantRepo;
    const specRepo = manager ? manager.getRepository(SpecificationOrmEntity) : this.specRepo;
    const attrRepo = manager ? manager.getRepository(VariantAttributeOrmEntity) : this.attrRepo;

    const productOrm = this._toProductOrm(product);

    const variants = product.getVariants();
    const specs = product.getSpecifications();

    const variantOrms = variants.map((v) => this._toVariantOrm(v));
    const specOrms = specs.map((s) => this._toSpecOrm(s));
    const attrOrms = variants.flatMap((v) =>
      v.getAttributes().map((attr) => this._toAttrOrm(attr)),
    );

    await productRepo.save(productOrm);

    await this.syncSpecifications(product.id, specOrms, specRepo);

    await this.syncVariants(variantOrms, variantRepo);

    await this.syncVariantAttributes(
      variants.map((v) => v.id),
      attrOrms,
      attrRepo,
    );
  }

  private async syncSpecifications(
    productId: string,
    nextSpecs: SpecificationOrmEntity[],
    specRepo: Repository<SpecificationOrmEntity>,
  ): Promise<void> {
    const existingSpecs = await specRepo.find({
      where: { productId },
      select: ['id'],
    });

    const nextSpecIds = new Set(nextSpecs.map((s) => s.id));
    const specIdsToDelete = existingSpecs.filter((s) => !nextSpecIds.has(s.id)).map((s) => s.id);

    if (nextSpecs.length > 0) {
      await specRepo.save(nextSpecs);
    }

    if (specIdsToDelete.length > 0) {
      await specRepo.delete(specIdsToDelete);
    }
  }

  private async syncVariants(
    nextVariants: VariantOrmEntity[],
    variantRepo: Repository<VariantOrmEntity>,
  ): Promise<void> {
    if (nextVariants.length === 0) return;

    await variantRepo.save(nextVariants);
  }

  private async syncVariantAttributes(
    variantIds: string[],
    nextAttrs: VariantAttributeOrmEntity[],
    attrRepo: Repository<VariantAttributeOrmEntity>,
  ): Promise<void> {
    if (variantIds.length === 0) return;

    const existingAttrs = await attrRepo.find({
      where: { variantId: In(variantIds) },
      select: ['id', 'variantId', 'attributeValueId'],
    });

    const nextKeys = new Set(nextAttrs.map((attr) => `${attr.variantId}:${attr.attributeValueId}`));

    const attrIdsToDelete = existingAttrs
      .filter((attr) => !nextKeys.has(`${attr.variantId}:${attr.attributeValueId}`))
      .map((attr) => attr.id);

    if (attrIdsToDelete.length > 0) {
      await attrRepo.delete(attrIdsToDelete);
    }

    if (nextAttrs.length > 0) {
      await attrRepo.save(nextAttrs);
    }
  }

  private _toProductOrm(product: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();

    orm.id = product.id;
    orm.name = product.name;
    orm.slug = product.slug;
    orm.categoryId = product.categoryId;
    orm.brandId = product.brandId;
    orm.description = product.description;
    orm.shortDescription = product.shortDescription;
    orm.images = product.images;
    orm.thumbnail = product.thumbnail;
    orm.status = product.status;
    orm.featured = product.featured;
    orm.seoTitle = product.seoTitle;
    orm.seoDescription = product.seoDescription;
    orm.searchKeywords = product.searchKeywords;
    orm.baseName = product.baseName;
    orm.createdAt = product.createdAt;
    orm.updatedAt = product.updatedAt;
    orm.deletedAt = product.deletedAt;

    return orm;
  }

  private _toVariantOrm(variant: Variant): VariantOrmEntity {
    const orm = new VariantOrmEntity();

    orm.id = variant.id;
    orm.productId = variant.productId;
    orm.name = variant.name;
    orm.sku = variant.sku;
    orm.price = variant.price;
    orm.compareAtPrice = variant.compareAtPrice;
    orm.image = variant.image;
    orm.sortOrder = variant.sortOrder;
    orm.stock = variant.stock;
    orm.reservedStock = variant.reservedStock;
    orm.isDefault = variant.isDefault;
    orm.isAvailable = variant.isAvailable;
    orm.createdAt = variant.createdAt;
    orm.updatedAt = variant.updatedAt;
    orm.deletedAt = variant.deletedAt;

    return orm;
  }

  private _toSpecOrm(spec: Specification): SpecificationOrmEntity {
    const orm = new SpecificationOrmEntity();

    orm.id = spec.id;
    orm.productId = spec.productId;
    orm.attributeId = spec.attributeId;
    orm.value = spec.value;
    orm.createdAt = spec.createdAt;
    orm.updatedAt = spec.updatedAt;

    return orm;
  }

  private _toAttrOrm(attr: VariantAttribute): VariantAttributeOrmEntity {
    const orm = new VariantAttributeOrmEntity();

    orm.id = attr.id;
    orm.variantId = attr.variantId;
    orm.attributeValueId = attr.attributeValueId;
    orm.createdAt = attr.createdAt;
    orm.updatedAt = attr.updatedAt;

    return orm;
  }
}
