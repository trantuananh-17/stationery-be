import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { VariantOrmEntity } from '../entities/typeorm-variant.entity';
import { IInventoryCommandRepository } from '../../application/ports/repositories/inventory-command';
import { VariantStockSnapshot } from '../../application/read-models/variant-stock.read-model';

@Injectable()
export class TypeOrmInventoryCommandRepository implements IInventoryCommandRepository {
  constructor(
    @InjectRepository(VariantOrmEntity)
    private readonly variantRepo: Repository<VariantOrmEntity>,
  ) {}

  async findVariants(variantIds: string[]): Promise<VariantStockSnapshot[]> {
    if (!variantIds.length) return [];

    const variants = await this.variantRepo.find({
      where: { id: In(variantIds) },
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

  async findVariant(variantId: string): Promise<VariantStockSnapshot | null> {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId },
      withDeleted: true,
    });

    if (!variant) return null;

    return {
      variantId: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      stock: Number(variant.stock),
      reservedStock: Number(variant.reservedStock),
      isAvailable: variant.isAvailable,
      deletedAt: variant.deletedAt,
    };
  }

  async reserveStockAtomic(variantId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const result = await this.variantRepo
      .createQueryBuilder()
      .update(VariantOrmEntity)
      .set({
        reservedStock: () => `"reservedStock" + :quantity`,
      })
      .where(`id = :variantId`, { variantId })
      .andWhere(`"deleted_at" IS NULL`)
      .andWhere(`"is_available" = true`)
      .andWhere(`"stock" - "reservedStock" >= :quantity`, { quantity })
      .execute();

    return !!result.affected;
  }

  async confirmStockAtomic(variantId: string, quantity: number): Promise<boolean> {
    const result = await this.variantRepo
      .createQueryBuilder()
      .update(VariantOrmEntity)
      .set({
        stock: () => `"stock" - :quantity`,
        reservedStock: () => `"reservedStock" - :quantity`,
      })
      .where(`id = :variantId`, { variantId })
      .andWhere(`"reservedStock" >= :quantity`, { quantity })
      .execute();

    return !!result.affected;
  }

  async releaseStockAtomic(variantId: string, quantity: number): Promise<boolean> {
    const result = await this.variantRepo
      .createQueryBuilder()
      .update(VariantOrmEntity)
      .set({
        reservedStock: () => `"reservedStock" - :quantity`,
      })
      .where(`id = :variantId`, { variantId })
      .andWhere(`"reservedStock" >= :quantity`, { quantity })
      .execute();

    return !!result.affected;
  }

  async restockAtomic(variantId: string, quantity: number): Promise<boolean> {
    const result = await this.variantRepo
      .createQueryBuilder()
      .update(VariantOrmEntity)
      .set({
        stock: () => `"stock" + :quantity`,
      })
      .setParameters({ quantity })
      .where(`id = :variantId`, { variantId })
      .execute();

    return !!result.affected;
  }
}
