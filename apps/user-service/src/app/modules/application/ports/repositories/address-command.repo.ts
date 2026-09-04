import { Address } from '../../../domain/entities/address.entity';

export abstract class IAddressCommandRepository {
  abstract save(address: Address): Promise<void>;

  abstract delete(userId: string, addressId: string): Promise<void>;

  /** Bỏ cờ mặc định của mọi địa chỉ khác — mỗi user chỉ được một địa chỉ mặc định. */
  abstract clearDefault(userId: string, exceptAddressId?: string): Promise<void>;

  abstract countByUser(userId: string): Promise<number>;
}
