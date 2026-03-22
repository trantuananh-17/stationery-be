import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductQueryRepository } from '../../application/ports/repositories/product-query.repo';
import { ProductInfoReadModel } from '../../application/read-models/product-info.read-model';
import { ProductItemReadModel } from '../../application/read-models/product-item.read.model';
import { ProductReadModel } from '../../application/read-models/product.read-model';
import { ProductOrderBy } from '../../domain/enum/product-orderby.enum';
import { ProductStatus } from '../../domain/enum/product-status.enum';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';
import { SpecificationOrmEntity } from '../entities/typeorm-specification.enity';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';

@Injectable()
export class TypeOrmProductQueryRepository implements IProductQueryRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepo: Repository<ProductOrmEntity>,

    @InjectRepository(VariantOrmEntity)
    private readonly variantRepo: Repository<VariantOrmEntity>,

    @InjectRepository(SpecificationOrmEntity)
    private readonly specRepo: Repository<SpecificationOrmEntity>,
  ) {}

  async findProductItemBase(variantId: string): Promise<ProductItemReadModel | null> {
    const rows = await this.variantRepo
      .createQueryBuilder('v')
      .leftJoin('v.product', 'p')
      .leftJoin('v.attributes', 'va')
      .leftJoin('va.attributeValue', 'av')
      .leftJoin('av.attribute', 'a')
      .select([
        'v.id AS "variantId"',
        'v.name AS "variantName"',
        'v.sku AS "sku"',
        'v.image AS "imageVariant"',
        'v.price AS "price"',
        'v.compareAtPrice AS "compareAtPrice"',
        'p.id AS "productId"',
        'p.name AS "productName"',
        'p.slug AS "productSlug"',
        'p.thumbnail AS "productThumbnail"',
        'a.name AS "attributeName"',
        'av.value AS "attributeValue"',
      ])
      .where('v.id = :variantId', { variantId })
      .getRawMany();

    console.log(JSON.stringify(rows, null, 2));

    if (!rows.length) return null;

    const first = rows[0];

    return {
      productId: first.productId,
      variantId: first.variantId,
      productName: first.productName,
      productSlug: first.productSlug,
      variantName: first.variantName,
      sku: first.sku,
      productThumbnail: first.productThumbnail,
      imageVariant: first.imageVariant,
      price: Number(first.price),
      compareAtPrice: Number(first.compareAtPrice),
      attributes: rows
        .filter((r) => r.attributeName && r.attributeValue)
        .map((r) => ({
          name: r.attributeName,
          value: r.attributeValue,
        })),
    };
  }

  async findRelatedProducts(params: {
    productId: string;
    categoryId: string;
    brandId: string;
    limit: number;
  }): Promise<ProductReadModel[]> {
    const { productId, categoryId, brandId, limit } = params;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.variants', 'v', 'v.is_default = :isDefault', {
        isDefault: true,
      })
      .where('p.category_id = :categoryId', { categoryId })
      .andWhere('p.id != :productId', { productId })
      .andWhere('p.deleted_at IS NULL')
      .andWhere('p.status = :status', { status: ProductStatus.ACTIVE })
      .select([
        'p.id AS id',
        'p.name AS name',
        'p.slug AS slug',
        'p.thumbnail AS thumbnail',
        'p.images AS images',
        'v.price AS price',
        'v.compare_at_price AS "compareAtPrice"',
      ])
      .orderBy('CASE WHEN p.brand_id = :brandId THEN 0 ELSE 1 END', 'ASC')
      .setParameter('brandId', brandId)
      .addOrderBy('p.created_at', 'DESC')
      .limit(limit);

    const raws = await qb.getRawMany();

    return raws.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      thumbnail: r.thumbnail,
      images: r.images,
      price: Number(r.price),
      compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : undefined,
    }));
  }

  async findRelatedBaseInfoById(
    productId: string,
  ): Promise<{ id: string; categoryId: string; brandId: string } | null> {
    const orm = await this.productRepo.findOne({
      where: { id: productId },
      select: {
        id: true,
        categoryId: true,
        brandId: true,
      },
    });

    if (!orm) return null;

    return {
      id: orm.id,
      categoryId: orm.categoryId,
      brandId: orm.brandId,
    };
  }

  async findFeaturedProducts(page: number, limit: number): Promise<QueryResult<ProductReadModel>> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.variants', 'v', 'v.is_default = :isDefault', {
        isDefault: true,
      })
      .where('p.featured = :featured', { featured: true })
      .andWhere('p.deletedAt IS NULL');

    const total = await qb.clone().getCount();

    qb.select([
      'p.id AS id',
      'p.name AS name',
      'p.slug AS slug',
      'p.thumbnail AS thumbnail',
      'p.images AS images',
      'v.price AS price',
      'v.compare_at_price AS "compareAtPrice"',
    ])
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('p.createdAt', 'DESC');

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        thumbnail: r.thumbnail,
        images: r.images,
        price: Number(r.price),
        compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : undefined,
      })),
      total,
    };
  }

  async findProductInfo(productId?: string, slug?: string): Promise<ProductInfoReadModel | null> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('c.parent', 'pc')
      .where('p.deletedAt IS NULL');

    if (productId) {
      qb.andWhere('p.id = :id', { id: productId });
    }

    if (slug) {
      qb.andWhere('p.slug = :slug', { slug });
    }

    const product = await qb
      .select([
        'p.id',
        'p.name',
        'p.slug',
        'p.thumbnail',
        'p.images',
        'p.description',
        'p.shortDescription',
        'p.status',
        'p.featured',
        'p.seoTitle',
        'p.seoDescription',
        'p.baseName',

        'c.id',
        'c.name',
        'c.slug',

        'pc.id',
        'pc.name',
        'pc.slug',
      ])
      .getOne();

    if (!product) {
      return null;
    }

    const actualProductId = product.id;

    const variants = await this.variantRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.attributes', 'va')
      .leftJoinAndSelect('va.attributeValue', 'av')
      .leftJoinAndSelect('av.attribute', 'a')
      .where('v.productId = :productId', { productId: actualProductId })
      .andWhere('v.deletedAt IS NULL')
      .orderBy('v.sortOrder', 'ASC')
      .addOrderBy('v.createdAt', 'ASC')
      .addOrderBy('a.sortOrder', 'ASC')
      .addOrderBy('av.sortOrder', 'ASC')
      .getMany();

    const specifications = await this.specRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.attribute', 'a')
      .where('s.productId = :productId', { productId: actualProductId })
      .orderBy('a.sortOrder', 'ASC')
      .addOrderBy('s.createdAt', 'ASC')
      .getMany();

    const mappedVariants = variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : undefined,
      stock: v.stock,
      reservedStock: v.reservedStock,
      image: v.image,
      sortOrder: v.sortOrder,
      isDefault: v.isDefault,
      isAvailable: v.isAvailable,
      attributes: (v.attributes ?? []).map((va) => ({
        attributeId: va.attributeValue.attribute.id,
        attributeName: va.attributeValue.attribute.name,
        attributeValueId: va.attributeValue.id,
        attributeValue: va.attributeValue.value,
        attributeValueSlug: va.attributeValue.slug,
      })),
    }));

    const variantOptionsMap = new Map<
      string,
      {
        attributeId: string;
        attributeName: string;
        values: Map<string, { id: string; value: string }>;
      }
    >();

    for (const variant of variants) {
      for (const va of variant.attributes ?? []) {
        const attribute = va.attributeValue.attribute;
        const attributeValue = va.attributeValue;

        if (!variantOptionsMap.has(attribute.id)) {
          variantOptionsMap.set(attribute.id, {
            attributeId: attribute.id,
            attributeName: attribute.name,
            values: new Map(),
          });
        }

        const optionGroup = variantOptionsMap.get(attribute.id);

        if (!optionGroup) return;

        optionGroup.values.set(attributeValue.id, {
          id: attributeValue.id,
          value: attributeValue.value,
        });
      }
    }

    const variantOptions = Array.from(variantOptionsMap.values()).map((item) => ({
      attributeId: item.attributeId,
      attributeName: item.attributeName,
      values: Array.from(item.values.values()),
    }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      images: product.images ?? [],
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        parent: product.category.parent
          ? {
              id: product.category.parent.id,
              name: product.category.parent.name,
              slug: product.category.parent.slug,
            }
          : undefined,
      },
      description: product.description,
      shortDescription: product.shortDescription,
      status: product.status,
      featured: product.featured,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      baseName: product.baseName,
      variants: mappedVariants,
      variantOptions,
      specifications: specifications.map((s) => ({
        id: s.id,
        attributeId: s.attributeId,
        attributeName: s.attribute.name,
        value: s.value,
      })),
    };
  }

  async findAll(filters: {
    keywords: string[];
    category?: string;
    brand?: string;
    orderBy?: ProductOrderBy;
    page: number;
    limit: number;
  }): Promise<QueryResult<ProductReadModel>> {
    const { keywords, category, brand, orderBy, page, limit } = filters;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.variants', 'v', 'v.is_default = :isDefault', {
        isDefault: true,
      })
      .andWhere('p.deletedAt IS NULL');

    if (keywords.length > 0) {
      qb.andWhere(
        `
      to_tsvector(
        'simple',
        unaccent(
          array_to_string(
            ARRAY(
              SELECT jsonb_array_elements_text(p.search_keywords)
            ),
            ' '
          )
        )
      )
      @@ plainto_tsquery('simple', unaccent(:query))
      `,
        {
          query: keywords.join(' '),
        },
      );
    }

    if (category && category?.trim()) {
      qb.andWhere('p.category_id = :category', {
        category,
      });
    }

    if (brand && brand?.trim()) {
      qb.andWhere('p.brand_id = :brand', {
        brand,
      });
    }

    const total = await qb.clone().getCount();

    qb.select([
      'p.id AS id',
      'p.name AS name',
      'p.slug AS slug',
      'p.thumbnail AS thumbnail',
      'p.images AS images',
      'v.price AS price',
      'v.compare_at_price AS "compareAtPrice"',
    ]);

    switch (orderBy) {
      case ProductOrderBy.PRICE_ASC:
        qb.orderBy('v.price', 'ASC');
        break;

      case ProductOrderBy.PRICE_DESC:
        qb.orderBy('v.price', 'DESC');
        break;

      default:
        qb.orderBy('p.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        thumbnail: r.thumbnail,
        images: r.images,
        price: Number(r.price),
        compareAtPrice: r.compareAtPrice ? Number(r.compareAtPrice) : undefined,
      })),
      total,
    };
  }
}
