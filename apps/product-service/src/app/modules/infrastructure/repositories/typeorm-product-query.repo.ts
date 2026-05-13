import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { IProductQueryRepository } from '../../application/ports/repositories/product-query.repo';
import { ProductInfoReadModel } from '../../application/read-models/product-info.read-model';
import { ProductItemReadModel } from '../../application/read-models/product-item.read.model';
import { ProductReadModel } from '../../application/read-models/product.read-model';
import { AdminProductOrderBy, ProductOrderBy } from '../../domain/enum/product-orderby.enum';
import { ProductStatus } from '../../domain/enum/product-status.enum';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';
import { SpecificationOrmEntity } from '../entities/typeorm-specification.enity';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';
import { GetProductAiDto } from '../../application/queries/get-product-ai/get-product-ai.dto';
import { ProductAiReadModel } from '../../application/read-models/product-ai.read-model';

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
      .leftJoin('p.brand', 'b');
    // .withDeleted();
    // .andWhere('p.deletedAt IS NULL');

    if (status === ProductStatus.DELETED) {
      qb.andWhere('p.deleted_at IS NOT NULL');
    } else {
      qb.andWhere('p.deleted_at IS NULL');

      if (status) {
        qb.andWhere('p.status = :status', { status });
      }
    }

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

    // if (status) {
    //   qb.andWhere('p.status = :status', { status });
    // }

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

  private normalizeAiText(input?: string): string {
    return (input || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildAiSearchTerms(...texts: Array<string | undefined>): string[] {
    const text = texts
      .filter((item): item is string => Boolean(item?.trim()))
      .join(' ')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s.]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) {
      return [];
    }

    const stopWords = new Set(
      [
        'cho',
        'cần',
        'mua',
        'tìm',
        'kiếm',
        'tư',
        'vấn',
        'sản',
        'phẩm',
        'nào',
        'gì',
        'với',
        'và',
        'hoặc',
        'trong',
        'khoảng',
        'dưới',
        'trên',
        'giá',
        'rẻ',
        'loại',
        'cái',
        'chiếc',
        'mình',
        'tôi',
        'em',
        'anh',
        'chị',
        'đi',
        'in',
      ].map((word) => this.normalizeAiText(word)),
    );

    return Array.from(
      new Set(
        text
          .split(/\s+/)
          .map((word) => word.trim())
          .filter(Boolean)
          .filter((word) => {
            const normalizedWord = this.normalizeAiText(word);

            return (
              word.length >= 2 || /^[a-z]\d+$/i.test(word) || /^[a-z]\d+$/i.test(normalizedWord)
            );
          })
          .filter((word) => !stopWords.has(this.normalizeAiText(word))),
      ),
    ).slice(0, 8);
  }

  private buildAiProductSearchCondition(paramName: string): string {
    return `
    LOWER(product.name) LIKE LOWER(:${paramName})
    OR LOWER(product.baseName) LIKE LOWER(:${paramName})
    OR LOWER(product.shortDescription) LIKE LOWER(:${paramName})
    OR LOWER(product.description) LIKE LOWER(:${paramName})
    OR LOWER(category.name) LIKE LOWER(:${paramName})
    OR LOWER(brand.name) LIKE LOWER(:${paramName})
    OR CAST(product.searchKeywords AS text) ILIKE :${paramName}
  `;
  }

  private buildAiVariantSearchCondition(paramName: string): string {
    return `
    LOWER(variant.name) LIKE LOWER(:${paramName})
    OR LOWER(variant.sku) LIKE LOWER(:${paramName})
  `;
  }

  private async resolveAiVariantFilterFromDb(
    rawKeywordTerms: string[],
    activeStatuses: ProductStatus[],
  ): Promise<{
    productTerms: string[];
    variantNames: string[];
    variantTermKeys: Set<string>;
  }> {
    if (rawKeywordTerms.length === 0) {
      return {
        productTerms: [],
        variantNames: [],
        variantTermKeys: new Set<string>(),
      };
    }

    const variantQb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.variants', 'variant')
      .select('DISTINCT variant.name', 'name')
      .where('product.deletedAt IS NULL')
      .andWhere('variant.deletedAt IS NULL')
      .andWhere('variant.isAvailable = :isAvailable', {
        isAvailable: true,
      })
      .andWhere('(variant.stock - variant.reservedStock) > 0')
      .andWhere('variant.name IS NOT NULL')
      .andWhere("TRIM(variant.name) <> ''");

    if (activeStatuses.length > 0) {
      variantQb.andWhere('product.status IN (:...activeStatuses)', {
        activeStatuses,
      });
    }

    const rows = await variantQb.getRawMany<{ name: string }>();

    const dbVariantNames = rows
      .map((row) => row.name?.trim())
      .filter((name): name is string => Boolean(name));

    const matchedVariantNames = new Set<string>();
    const variantTermKeys = new Set<string>();

    for (const variantName of dbVariantNames) {
      const normalizedVariantName = this.normalizeAiText(variantName);
      const normalizedVariantParts = this.buildAiSearchTerms(variantName).map((term) =>
        this.normalizeAiText(term),
      );

      for (const keywordTerm of rawKeywordTerms) {
        const normalizedKeywordTerm = this.normalizeAiText(keywordTerm);

        const isMatched =
          normalizedVariantName === normalizedKeywordTerm ||
          normalizedVariantParts.includes(normalizedKeywordTerm);

        if (isMatched) {
          matchedVariantNames.add(variantName);
          variantTermKeys.add(normalizedKeywordTerm);
        }
      }
    }

    const productTerms = rawKeywordTerms.filter((term) => {
      return !variantTermKeys.has(this.normalizeAiText(term));
    });

    return {
      productTerms,
      variantNames: Array.from(matchedVariantNames),
      variantTermKeys,
    };
  }

  async findProductsForAiAdvisor(filters: GetProductAiDto): Promise<ProductAiReadModel[]> {
    const limit = this.normalizeAiLimit(filters.limit);

    const activeStatuses = Object.values(ProductStatus).filter(
      (status) => status !== ProductStatus.DRAFT,
    );

    const rawKeywordTerms = this.buildAiSearchTerms(filters.keyword);
    const contextTerms = this.buildAiSearchTerms(filters.audience, filters.need);

    const variantFilter = await this.resolveAiVariantFilterFromDb(rawKeywordTerms, activeStatuses);

    const keywordTerms = variantFilter.productTerms;
    const variantNames = variantFilter.variantNames;

    console.log('AI_PRODUCT_SEARCH_DEBUG:', {
      keyword: filters.keyword,
      rawKeywordTerms,
      keywordTerms,
      variantNames,
      audience: filters.audience,
      need: filters.need,
    });

    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.variants', 'variant')
      .leftJoin('product.category', 'category')
      .leftJoin('product.brand', 'brand')
      .leftJoinAndSelect('product.specifications', 'spec')
      .where('product.deletedAt IS NULL')
      .andWhere('variant.deletedAt IS NULL')
      .andWhere('variant.isAvailable = :isAvailable', {
        isAvailable: true,
      })
      .andWhere('(variant.stock - variant.reservedStock) > 0');

    if (activeStatuses.length > 0) {
      qb.andWhere('product.status IN (:...activeStatuses)', {
        activeStatuses,
      });
    }

    /**
     * 1. Keyword sản phẩm.
     *
     * Ví dụ:
     * - "bút đỏ" => keywordTerms = ["bút"]
     * - "giấy A3" => keywordTerms = ["giấy"]
     *
     * Không search variant.name ở đây.
     */
    if (keywordTerms.length > 0) {
      qb.andWhere(
        new Brackets((subQb) => {
          keywordTerms.forEach((term, index) => {
            const paramName = `keywordTerm${index}`;
            const value = `%${term}%`;
            const condition = this.buildAiProductSearchCondition(paramName);

            if (index === 0) {
              subQb.where(condition, {
                [paramName]: value,
              });
            } else {
              subQb.orWhere(condition, {
                [paramName]: value,
              });
            }
          });
        }),
      );
    }

    /**
     * 2. Keyword variant.
     *
     * Ví dụ:
     * - "bút đỏ" => variantNames = ["Đỏ"]
     * - "giấy A3" => variantNames = ["A3"]
     *
     * Có variant requested thì bắt buộc variant phải match.
     */
    if (variantNames.length > 0) {
      qb.andWhere(
        new Brackets((subQb) => {
          variantNames.forEach((variantName, index) => {
            const paramName = `variantName${index}`;
            const value = `%${variantName}%`;
            const condition = this.buildAiVariantSearchCondition(paramName);

            if (index === 0) {
              subQb.where(condition, {
                [paramName]: value,
              });
            } else {
              subQb.orWhere(condition, {
                [paramName]: value,
              });
            }
          });
        }),
      );
    }

    /**
     * 3. Chỉ dùng audience + need khi user không truyền keyword.
     *
     * Tránh case:
     * keyword = "bút đỏ"
     * audience = "học sinh"
     * need = "đi học"
     *
     * Rồi audience/need kéo ra sản phẩm khác variant.
     */
    if (rawKeywordTerms.length === 0 && contextTerms.length > 0) {
      qb.andWhere(
        new Brackets((subQb) => {
          contextTerms.forEach((term, index) => {
            const paramName = `contextTerm${index}`;
            const value = `%${term}%`;
            const condition = this.buildAiProductSearchCondition(paramName);

            if (index === 0) {
              subQb.where(condition, {
                [paramName]: value,
              });
            } else {
              subQb.orWhere(condition, {
                [paramName]: value,
              });
            }
          });
        }),
      );
    }

    const category = filters.category?.trim();

    if (category) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('LOWER(category.name) LIKE LOWER(:category)', {
              category: `%${category}%`,
            })
            .orWhere('CAST(product.categoryId AS text) = :categoryId', {
              categoryId: category,
            });
        }),
      );
    }

    const brand = filters.brand?.trim();

    if (brand) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('LOWER(brand.name) LIKE LOWER(:brand)', {
              brand: `%${brand}%`,
            })
            .orWhere('CAST(product.brandId AS text) = :brandId', {
              brandId: brand,
            });
        }),
      );
    }

    if (filters.budgetMin && filters.budgetMin > 0) {
      qb.andWhere('variant.price >= :budgetMin', {
        budgetMin: filters.budgetMin,
      });
    }

    if (filters.budgetMax && filters.budgetMax > 0) {
      qb.andWhere('variant.price <= :budgetMax', {
        budgetMax: filters.budgetMax,
      });
    }

    qb.select('product.id', 'product_id')
      .addSelect('product.name', 'product_name')
      .addSelect('product.slug', 'product_slug')
      .addSelect('product.categoryId', 'category_id')
      .addSelect('product.brandId', 'brand_id')
      .addSelect('product.short_description', 'product_short_description')
      .addSelect('product.description', 'product_description')
      .addSelect('product.thumbnail', 'product_thumbnail')
      .addSelect('category.name', 'category_name')
      .addSelect('brand.name', 'brand_name')
      .addSelect('variant.id', 'variant_id')
      .addSelect('variant.name', 'variant_name')
      .addSelect('variant.sku', 'variant_sku')
      .addSelect('variant.price', 'variant_price')
      .addSelect('variant.compare_at_price', 'variant_compare_at_price')
      .addSelect('variant.stock', 'variant_stock')
      .addSelect('variant.reservedStock', 'variant_reserved_stock')
      .addSelect('variant.image', 'variant_image')
      .addSelect('variant.is_default', 'variant_is_default')
      .addSelect('variant.sortOrder', 'variant_sort_order');

    if (filters.sortBy === 'price_asc') {
      qb.orderBy('variant.price', 'ASC')
        .addOrderBy('variant.isDefault', 'DESC')
        .addOrderBy('variant.sortOrder', 'ASC');
    } else if (filters.sortBy === 'price_desc') {
      qb.orderBy('variant.price', 'DESC')
        .addOrderBy('variant.isDefault', 'DESC')
        .addOrderBy('variant.sortOrder', 'ASC');
    } else {
      qb.orderBy('variant.isDefault', 'DESC')
        .addOrderBy('variant.sortOrder', 'ASC')
        .addOrderBy('variant.price', 'ASC');
    }

    qb.limit(limit * 3);

    const rows = await qb.getRawMany<ProductAiRawRow>();

    return this.mapAiProductRows(rows, limit);
  }
  private normalizeAiLimit(limit?: number): number {
    if (!limit || limit <= 0) {
      return 8;
    }

    if (limit > 20) {
      return 20;
    }

    return limit;
  }

  private mapAiProductRows(rows: ProductAiRawRow[], limit: number): ProductAiReadModel[] {
    const result: ProductAiReadModel[] = [];
    const usedProductIds = new Set<string>();

    for (const row of rows) {
      const productId = String(row.product_id);

      if (usedProductIds.has(productId)) {
        continue;
      }

      usedProductIds.add(productId);

      const stock = Number(row.variant_stock || 0);
      const reservedStock = Number(row.variant_reserved_stock || 0);
      const availableStock = Math.max(stock - reservedStock, 0);

      const product = new ProductAiReadModel();

      product.productId = productId;
      product.productName = row.product_name || '';
      product.slug = row.product_slug || '';

      product.categoryId = row.category_id || '';
      product.categoryName = row.category_name || '';

      product.brandId = row.brand_id || '';
      product.brandName = row.brand_name || '';

      product.shortDescription = row.product_short_description || '';
      product.description = row.product_description || '';
      product.thumbnail = row.product_thumbnail || '';

      product.variantId = String(row.variant_id);
      product.variantName = row.variant_name || '';
      product.sku = row.variant_sku || '';

      product.price = Math.round(Number(row.variant_price || 0));
      product.compareAtPrice = Math.round(Number(row.variant_compare_at_price || 0));
      product.stock = availableStock;

      product.thumbnail = row.product_thumbnail || '';
      product.variantImage = row.variant_image || '';
      product.productUrl = `/products/${row.product_slug}`;

      result.push(product);

      if (result.length >= limit) {
        break;
      }
    }

    return result;
  }
}

type ProductAiRawRow = {
  product_id: string;
  product_name: string;
  product_slug: string;

  category_id: string | null;
  category_name: string | null;

  brand_id: string | null;
  brand_name: string | null;

  product_short_description: string | null;
  product_description: string | null;
  product_thumbnail: string | null;

  variant_id: string;
  variant_name: string;
  variant_sku: string | null;

  variant_price: string | number | null;
  variant_compare_at_price: string | number | null;
  variant_stock: string | number | null;
  variant_reserved_stock: string | number | null;

  variant_image: string | null;
  variant_is_default: boolean | null;
  variant_sort_order: number | null;
};
