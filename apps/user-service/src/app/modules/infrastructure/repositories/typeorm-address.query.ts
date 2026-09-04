import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IAddressQueryRepository } from '../../application/ports/repositories/address-query.repo';
import { Address } from '../../domain/entities/address.entity';
import { AddressOrmEntity } from '../entities/typeorm-address.entity';

@Injectable()
export class TypeOrmAddressQueryRepository implements IAddressQueryRepository {
  constructor(
    @InjectRepository(AddressOrmEntity)
    private readonly repo: Repository<AddressOrmEntity>,
  ) {}

  async findByUser(userId: string): Promise<Address[]> {
    const rows = await this.repo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });

    return rows.map(toDomain);
  }

  async findOne(userId: string, addressId: string): Promise<Address | null> {
    const row = await this.repo.findOne({ where: { id: addressId, userId } });

    return row ? toDomain(row) : null;
  }
}

function toDomain(row: AddressOrmEntity): Address {
  return Address.restore({
    id: row.id,
    userId: row.userId,
    fullName: row.fullName,
    phone: row.phone,
    address1: row.address1,
    address2: row.address2 ?? undefined,
    ward: row.ward,
    district: row.district,
    city: row.city,
    isDefault: row.isDefault,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
