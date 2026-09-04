import { Address } from '../../../domain/entities/address.entity';

export abstract class IAddressQueryRepository {
  abstract findByUser(userId: string): Promise<Address[]>;

  abstract findOne(userId: string, addressId: string): Promise<Address | null>;
}
