import { Injectable } from '@nestjs/common';
import { IProductQueryRepository } from '../../application/ports/repositories/product-query.repo';
import { Product } from '../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmProductQueryRepository implements IProductQueryRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

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
}
