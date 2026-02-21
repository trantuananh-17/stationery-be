import { Injectable, Logger } from '@nestjs/common';
import { IProductCommandRepository } from '../../application/ports/product-command.repo';
import { Product } from '../../domain/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/typeorm-product.entity';

@Injectable()
export class TypeOrmProductCommandRepository implements IProductCommandRepository {
  constructor(
    @InjectRepository(ProductOrmEntity) private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async create(product: Product): Promise<void> {
    await this.repo.save(product);
    Logger.log(product.id, 'TypeOrmProductCommandRepo:SAVED');
  }
  update(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
