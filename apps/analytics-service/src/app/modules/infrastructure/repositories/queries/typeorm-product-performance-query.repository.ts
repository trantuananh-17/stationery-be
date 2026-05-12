import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { IProductPerformanceQueryRepository } from '../../../applications/ports/queries/product-performance-query.repository';
import { ProductPerformanceOrmEntity } from '../../entities/product-performance.orm-entity';
import {
  ProductPerformanceChartDto,
  TopProductDto,
} from '../../../applications/ports/dtos/product-performance.dto';

@Injectable()
export class TypeOrmProductPerformanceQueryRepository
  implements IProductPerformanceQueryRepository
{
  constructor(
    @InjectRepository(ProductPerformanceOrmEntity)
    private readonly repo: Repository<ProductPerformanceOrmEntity>,
  ) {}

  async getTopProducts(
    startDate: string,
    endDate: string,
    limit: number,
  ): Promise<TopProductDto[]> {
    const raws = await this.repo
      .createQueryBuilder('productPerformance')
      .select('productPerformance.productId', 'productId')
      .addSelect('productPerformance.productName', 'productName')
      .addSelect('SUM(productPerformance.quantitySold)', 'quantitySold')
      .addSelect('SUM(productPerformance.totalRevenue)', 'totalRevenue')
      .where('productPerformance.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('productPerformance.productId')
      .addGroupBy('productPerformance.productName')
      .orderBy('SUM(productPerformance.quantitySold)', 'DESC')
      .limit(limit)
      .getRawMany();

    return raws.map((raw) => ({
      productId: raw.productId,

      productName: raw.productName,

      quantitySold: Number(raw.quantitySold),

      totalRevenue: Number(raw.totalRevenue),
    }));
  }

  async getChart(
    productId: string,
    startDate: string,
    endDate: string,
  ): Promise<ProductPerformanceChartDto[]> {
    const raws = await this.repo
      .createQueryBuilder('productPerformance')
      .select('productPerformance.bucketDate', 'date')
      .addSelect('SUM(productPerformance.quantitySold)', 'quantitySold')
      .addSelect('SUM(productPerformance.totalRevenue)', 'totalRevenue')
      .where('productPerformance.productId = :productId', {
        productId,
      })
      .andWhere('productPerformance.bucketDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('productPerformance.bucketDate')
      .orderBy('productPerformance.bucketDate', 'ASC')
      .getRawMany();

    return raws.map((raw) => ({
      date: raw.date,

      quantitySold: Number(raw.quantitySold),

      totalRevenue: Number(raw.totalRevenue),
    }));
  }
}
