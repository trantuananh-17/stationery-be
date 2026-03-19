import { Injectable } from '@nestjs/common';
import { IProductQueryRepository } from '../../application/ports/repositories/product-query.repo';
import { Product } from '../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';
import { Repository } from 'typeorm';
import { Specification } from '../../domain/entities/specification.entity';
import { SpecificationOrmEntity } from '../entities/typeorm-specification.enity';
import { Variant } from '../../domain/entities/variant.entity';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';
import { VariantAttribute } from '../../domain/entities/variant-attribute.entity';
import { VariantAttributeOrmEntity } from '../entities/typeorm-variant-attribute.entity';

@Injectable()
export class TypeOrmProductQueryRepository implements IProductQueryRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findById(productId: string): Promise<Product | null> {
    const orm = await this.repo.findOne({
      where: { id: productId },
      relations: {
        specifications: true,
        variants: {
          attributes: true,
        },
      },
    });

    if (!orm) return null;

    return this._toProductDomain(orm);
  }

  getAll(page: number, limit: number): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getById(): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  async findMaxSlug(prefix: string): Promise<string | null> {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('p.slug')
      .where('p.slug LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy(
        `
      CASE 
        WHEN p.slug = :exact THEN 0
        ELSE CAST(SUBSTRING(p.slug FROM '[0-9]+$') AS INTEGER)
      END
      `,
        'DESC',
      )
      .setParameter('exact', prefix)
      .limit(1)
      .getRawOne();

    return result?.p_slug ?? null;
  }

  private _toProductDomain(orm: ProductOrmEntity): Product {
    const product = new Product({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      categoryId: orm.categoryId,
      brandId: orm.brandId,
      description: orm.description,
      shortDescription: orm.shortDescription,
      images: orm.images ?? [],
      thumbnail: orm.thumbnail,
      status: orm.status,
      featured: orm.featured,
      seoTitle: orm.seoTitle,
      seoDescription: orm.seoDescription,
      searchKeywords: orm.searchKeywords ?? [],
      baseName: orm.baseName,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });

    for (const specOrm of orm.specifications ?? []) {
      product.loadSpecification(this._toSpecDomain(specOrm));
    }

    for (const variantOrm of orm.variants ?? []) {
      product.loadVariant(this._toVariantDomain(variantOrm));
    }

    return product;
  }

  private _toSpecDomain(orm: SpecificationOrmEntity): Specification {
    return new Specification({
      id: orm.id,
      productId: orm.productId,
      attributeId: orm.attributeId,
      value: orm.value,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private _toVariantDomain(orm: VariantOrmEntity): Variant {
    const variant = new Variant({
      id: orm.id,
      productId: orm.productId,
      name: orm.name,
      sku: orm.sku,
      price: orm.price,
      compareAtPrice: orm.compareAtPrice,
      stock: orm.stock,
      reservedStock: orm.reservedStock,
      images: orm.images,
      sortOrder: orm.sortOrder,
      isDefault: orm.isDefault,
      isAvailable: orm.isAvailable,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });

    for (const attrOrm of orm.attributes ?? []) {
      variant.loadAttribute(this._toAttrDomain(attrOrm));
    }

    return variant;
  }

  private _toAttrDomain(orm: VariantAttributeOrmEntity): VariantAttribute {
    return new VariantAttribute({
      id: orm.id,
      variantId: orm.variantId,
      attributeValueId: orm.attributeValueId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
