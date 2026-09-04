import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { IInventoryQueryRepository } from '../../application/ports/repositories/inventory-query.repo';
import { InventoryItemReadModel } from '../../application/read-models/inventory-item.read-model';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';

@Injectable()
export class TypeOrmInventoryQueryRepository implements IInventoryQueryRepository {
  constructor(
    @InjectRepository(VariantOrmEntity)
    private readonly variantRepo: Repository<VariantOrmEntity>,
  ) {}

  async findAll(filters: {
    keywords: string[];
    lowStockThreshold?: number;
    page: number;
    limit: number;
  }): Promise<QueryResult<InventoryItemReadModel>> {
    const { keywords, lowStockThreshold, page, limit } = filters;

    const query = this.variantRepo
      .createQueryBuilder('variant')
      .innerJoin('variant.product', 'product')
      .where('variant.deleted_at IS NULL');

    if (keywords.length) {
      query.andWhere(
        new Brackets((qb) => {
          keywords.forEach((keyword, index) => {
            const param = `keyword${index}`;

            qb.orWhere(`product.name ILIKE :${param}`, { [param]: `%${keyword}%` })
              .orWhere(`variant.name ILIKE :${param}`, { [param]: `%${keyword}%` })
              .orWhere(`variant.sku ILIKE :${param}`, { [param]: `%${keyword}%` });
          });
        }),
      );
    }

    if (lowStockThreshold !== undefined) {
      query.andWhere('(variant.stock - variant.reserved_stock) <= :threshold', {
        threshold: lowStockThreshold,
      });
    }

    const [rows, total] = await query
      .orderBy('(variant.stock - variant.reserved_stock)', 'ASC')
      .addOrderBy('product.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'variant.id',
        'variant.name',
        'variant.sku',
        'variant.stock',
        'variant.reservedStock',
        'variant.isAvailable',
        'variant.image',
        'product.id',
        'product.name',
        'product.thumbnail',
      ])
      .getManyAndCount();

    const items: InventoryItemReadModel[] = rows.map((variant) => ({
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku ?? '',
      productId: variant.product?.id ?? variant.productId,
      productName: variant.product?.name ?? '',
      thumbnail: variant.image ?? variant.product?.thumbnail ?? '',
      stock: Number(variant.stock),
      reservedStock: Number(variant.reservedStock),
      isAvailable: variant.isAvailable,
    }));

    return { items, total };
  }
}
