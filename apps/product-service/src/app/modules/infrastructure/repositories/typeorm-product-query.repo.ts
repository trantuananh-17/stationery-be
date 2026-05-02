import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductQueryRepository } from '../../application/ports/repositories/product-query.repo';
import { ProductInfoReadModel } from '../../application/read-models/product-info.read-model';
import { ProductItemReadModel } from '../../application/read-models/product-item.read.model';
import { ProductReadModel } from '../../application/read-models/product.read-model';
import { AdminProductOrderBy, ProductOrderBy } from '../../domain/enum/product-orderby.enum';
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
        'v.stock AS stock',
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
      stock: first.stock,
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
      .leftJoin('p.category', 'c')
      .leftJoin('p.brand', 'b')
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
        'p.description AS description',
        'p.status AS status',
        'p.created_at AS "createdAt"',

        'v.sku AS sku',
        'v.price AS price',
        'v.compare_at_price AS "compareAtPrice"',
        'v.stock AS stock',

        'c.name AS category',
        'b.name AS brand',
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
      description: r.description,
      sku: r.sku,
      category: r.category,
      brand: r.brand,
      status: r.status,
      price: Number(r.price),
      compareAtPrice:
        r.compareAtPrice !== null && r.compareAtPrice !== undefined
          ? Number(r.compareAtPrice)
          : null,
      stock: Number(r.stock),
      createdAt: new Date(r.createdAt),
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
      .leftJoin('p.category', 'c')
      .leftJoin('p.brand', 'b')
      .where('p.featured = :featured', { featured: true })
      .andWhere('p.deleted_at IS NULL');

    const total = await qb.clone().getCount();

    qb.select([
      'p.id AS id',
      'p.name AS name',
      'p.slug AS slug',
      'p.thumbnail AS thumbnail',
      'p.images AS images',
      'p.description AS description',
      'p.status AS status',
      'p.created_at AS "createdAt"',

      'v.sku AS sku',
      'v.price AS price',
      'v.compare_at_price AS "compareAtPrice"',
      'v.stock AS stock',

      'c.name AS category',
      'b.name AS brand',
    ])
      .orderBy('p.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        thumbnail: r.thumbnail,
        images: r.images,
        description: r.description,
        sku: r.sku,
        category: r.category,
        brand: r.brand,
        status: r.status,
        price: Number(r.price),
        compareAtPrice:
          r.compareAtPrice !== null && r.compareAtPrice !== undefined
            ? Number(r.compareAtPrice)
            : null,
        stock: Number(r.stock),
        createdAt: new Date(r.createdAt),
      })),
      total,
    };
  }

  async findProductInfo(productId?: string, slug?: string): Promise<ProductInfoReadModel | null> {
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('p.brand', 'b')
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

        'b.id',
        'b.name',
        'b.slug',

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

        if (!optionGroup) return null;

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

      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
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
    status?: ProductStatus;
    orderBy?: AdminProductOrderBy;
    page: number;
    limit: number;
  }): Promise<QueryResult<ProductReadModel>> {
    const { keywords, status, orderBy, page, limit } = filters;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.variants', 'v', 'v.is_default = :isDefault', {
        isDefault: true,
      })
      .leftJoin('p.variants', 'all_variants')
      .leftJoin('p.category', 'c')
      .leftJoin('p.brand', 'b')
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

    if (status) {
      qb.andWhere('p.status = :status', { status });
    }

    const total = await qb.clone().getCount();

    qb.select([
      'p.id AS id',
      'p.name AS name',
      'p.slug AS slug',
      'p.thumbnail AS thumbnail',
      'p.short_description AS "shortDescription"',
      'p.status AS status',
      'p.created_at AS "createdAt"',

      'v.sku AS sku',
      'v.price AS price',
      'v.compare_at_price AS "compareAtPrice"',

      'COALESCE(SUM(all_variants.stock - all_variants.reservedStock), 0) AS stock',

      'c.name AS category',
      'b.name AS brand',
    ]);

    qb.groupBy('p.id').addGroupBy('v.id').addGroupBy('c.id').addGroupBy('b.id');

    switch (orderBy) {
      case AdminProductOrderBy.PRICE_ASC:
        qb.orderBy('v.price', 'ASC');
        break;

      case AdminProductOrderBy.PRICE_DESC:
        qb.orderBy('v.price', 'DESC');
        break;

      case AdminProductOrderBy.CREATED_AT_ASC:
        qb.orderBy('p.created_at', 'ASC');
        break;

      case AdminProductOrderBy.CREATED_AT_DESC:
        qb.orderBy('p.created_at', 'DESC');
        break;

      case AdminProductOrderBy.NAME_ASC:
        qb.orderBy('p.name', 'ASC');
        break;

      case AdminProductOrderBy.NAME_DESC:
        qb.orderBy('p.name', 'DESC');
        break;

      case AdminProductOrderBy.STOCK_ASC:
        qb.orderBy('stock', 'ASC');
        break;

      case AdminProductOrderBy.STOCK_DESC:
        qb.orderBy('stock', 'DESC');
        break;

      default:
        qb.orderBy('p.created_at', 'DESC');
    }

    qb.offset((page - 1) * limit).limit(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        thumbnail: r.thumbnail,
        description: r.shortDescription,
        sku: r.sku,
        category: r.category,
        brand: r.brand,
        status: r.status,
        price: Number(r.price),
        compareAtPrice:
          r.compareAtPrice !== null && r.compareAtPrice !== undefined
            ? Number(r.compareAtPrice)
            : null,
        stock: Number(r.stock),
        createdAt: new Date(r.createdAt),
      })),
      total,
    };
  }

  async findAllActive(filters: {
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
      .leftJoin('p.variants', 'all_variants')
      .leftJoin('p.category', 'c')
      .leftJoin('p.brand', 'b')
      .andWhere('p.deletedAt IS NULL')
      .andWhere('p.status = :status', { status: ProductStatus.ACTIVE });

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

    if (category && category.trim()) {
      qb.andWhere('p.category_id = :category', {
        category,
      });
    }

    if (brand && brand.trim()) {
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
      'p.description AS description',
      'p.status AS status',
      'p.created_at AS "createdAt"',

      'v.sku AS sku',
      'v.price AS price',
      'v.compare_at_price AS "compareAtPrice"',

      'COALESCE(SUM(all_variants.stock - all_variants.reservedStock), 0) AS stock',

      'c.name AS category',
      'b.name AS brand',
    ]);

    qb.groupBy('p.id').addGroupBy('v.id').addGroupBy('c.id').addGroupBy('b.id');

    switch (orderBy) {
      case ProductOrderBy.PRICE_ASC:
        qb.orderBy('v.price', 'ASC');
        break;

      case ProductOrderBy.PRICE_DESC:
        qb.orderBy('v.price', 'DESC');
        break;

      case ProductOrderBy.NAME_ASC:
        qb.orderBy('p.name', 'ASC');
        break;

      case ProductOrderBy.NAME_DESC:
        qb.orderBy('p.name', 'DESC');
        break;

      default:
        qb.orderBy('p.created_at', 'DESC');
    }

    qb.offset((page - 1) * limit).limit(limit);

    const raws = await qb.getRawMany();

    return {
      items: raws.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        thumbnail: r.thumbnail,
        description: r.description,
        sku: r.sku,
        category: r.category,
        brand: r.brand,
        status: r.status,
        price: Number(r.price),
        compareAtPrice:
          r.compareAtPrice !== null && r.compareAtPrice !== undefined
            ? Number(r.compareAtPrice)
            : null,
        stock: Number(r.stock),
        createdAt: new Date(r.createdAt),
      })),
      total,
    };
  }
}
