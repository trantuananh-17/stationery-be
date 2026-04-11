import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';
import { getManager } from '../helpers/get-manager.helper';
import { IInventoryCommandRepository } from '../../application/ports/repositories/inventory-command';
import { VariantStockSnapshot } from '../../application/read-models/variant-stock.read-model';

@Injectable()
export class TypeOrmInventoryCommandRepository implements IInventoryCommandRepository {
  constructor(
    @InjectRepository(VariantOrmEntity)
    private readonly variantRepo: Repository<VariantOrmEntity>,
  ) {}

  async findVariantsForUpdate(variantIds: string[]): Promise<VariantStockSnapshot[]> {
    if (variantIds.length === 0) {
      return [];
    }

    const manager = getManager();
    const variantRepo = manager ? manager.getRepository(VariantOrmEntity) : this.variantRepo;

    const variants = await variantRepo.find({
      where: {
        id: In(variantIds),
      },
      lock: {
        mode: 'pessimistic_write',
      },
      withDeleted: true,
    });

    return variants.map((variant) => ({
      variantId: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      stock: Number(variant.stock),
      reservedStock: Number(variant.reservedStock),
      isAvailable: variant.isAvailable,
      deletedAt: variant.deletedAt,
    }));
  }

  async reserveStock(variantId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const manager = getManager();
    const variantRepo = manager ? manager.getRepository(VariantOrmEntity) : this.variantRepo;

    const variant = await variantRepo.findOne({
      where: { id: variantId },
      lock: {
        mode: 'pessimistic_write',
      },
      withDeleted: true,
    });

    if (!variant || variant.deletedAt) {
      throw new Error(`Variant ${variantId} not found`);
    }

    if (!variant.isAvailable) {
      throw new Error(`Variant ${variantId} is inactive`);
    }

    const availableStock = Number(variant.stock) - Number(variant.reservedStock);

    if (availableStock < quantity) {
      throw new Error(`Insufficient stock for variant ${variantId}`);
    }

    variant.reservedStock = Number(variant.reservedStock) + quantity;

    await variantRepo.save(variant);
  }
}
