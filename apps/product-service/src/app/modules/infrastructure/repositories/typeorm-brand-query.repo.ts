import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBrandQueryRepository } from '../../application/ports/repositories/brand-query.repo';
import { BrandOrmEntity } from '../entities/typeorm-brand.entity';

@Injectable()
export class TypeOrmBrandQueryRepository implements IBrandQueryRepository {
  constructor(
    @InjectRepository(BrandOrmEntity)
    private readonly repo: Repository<BrandOrmEntity>,
  ) {}

  async findBrandExist(brandId: string): Promise<boolean> {
    return this.repo.exist({
      where: { id: brandId },
    });
  }

  async findBySlug(brandSlug: string): Promise<string | null> {
    const brand = await this.repo.findOne({
      where: { slug: brandSlug },
      select: ['id'],
    });

    return brand?.id ?? null;
  }
}
