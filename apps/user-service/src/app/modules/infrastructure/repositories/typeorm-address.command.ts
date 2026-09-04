import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { IAddressCommandRepository } from '../../application/ports/repositories/address-command.repo';
import { Address } from '../../domain/entities/address.entity';
import { AddressOrmEntity } from '../entities/typeorm-address.entity';

@Injectable()
export class TypeOrmAddressCommandRepository implements IAddressCommandRepository {
  constructor(
    @InjectRepository(AddressOrmEntity)
    private readonly repo: Repository<AddressOrmEntity>,
  ) {}

  async save(address: Address): Promise<void> {
    await this.repo.save({
      id: address.id,
      userId: address.userId,
      fullName: address.fullName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    });
  }

  async delete(userId: string, addressId: string): Promise<void> {
    await this.repo.delete({ id: addressId, userId });
  }

  async clearDefault(userId: string, exceptAddressId?: string): Promise<void> {
    await this.repo.update(
      exceptAddressId ? { userId, id: Not(exceptAddressId) } : { userId },
      { isDefault: false },
    );
  }

  async countByUser(userId: string): Promise<number> {
    return this.repo.count({ where: { userId } });
  }
}
