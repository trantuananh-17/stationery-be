import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { ICouponRepository } from '../../application/ports/repositories/coupon.repo';
import { Coupon } from '../../domain/entities/coupon.entity';
import { CouponOrmEntity } from '../entities/typeorm-coupon.entity';

@Injectable()
export class TypeOrmCouponRepository implements ICouponRepository {
  constructor(
    @InjectRepository(CouponOrmEntity)
    private readonly repo: Repository<CouponOrmEntity>,
  ) {}

  async save(coupon: Coupon): Promise<void> {
    await this.repo.save({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      startsAt: coupon.startsAt ?? undefined,
      expiresAt: coupon.expiresAt ?? undefined,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    });
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const row = await this.repo.findOne({ where: { code: code.trim().toUpperCase() } });

    return row ? toDomain(row) : null;
  }

  async findById(id: string): Promise<Coupon | null> {
    const row = await this.repo.findOne({ where: { id } });

    return row ? toDomain(row) : null;
  }

  async findAll(filters: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<QueryResult<Coupon>> {
    const { search, page, limit } = filters;

    const [rows, total] = await this.repo.findAndCount({
      where: search ? { code: ILike(`%${search.trim()}%`) } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: rows.map(toDomain), total };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete({ id });

    return !!result.affected;
  }

  async incrementUsage(id: string): Promise<boolean> {
    // Điều kiện usage_limit nằm ngay trong UPDATE để hai đơn đặt cùng lúc
    // không thể cùng dùng lượt cuối cùng.
    const result = await this.repo
      .createQueryBuilder()
      .update(CouponOrmEntity)
      .set({ usedCount: () => 'used_count + 1' })
      .where('id = :id', { id })
      .andWhere('(usage_limit = 0 OR used_count < usage_limit)')
      .execute();

    return !!result.affected;
  }
}

function toDomain(row: CouponOrmEntity): Coupon {
  return Coupon.restore({
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minOrderAmount: Number(row.minOrderAmount),
    maxDiscount: Number(row.maxDiscount),
    startsAt: row.startsAt ?? undefined,
    expiresAt: row.expiresAt ?? undefined,
    usageLimit: row.usageLimit,
    usedCount: row.usedCount,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
