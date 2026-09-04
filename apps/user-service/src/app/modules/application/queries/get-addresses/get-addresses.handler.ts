import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Address } from '../../../domain/entities/address.entity';
import { IAddressQueryRepository } from '../../ports/repositories/address-query.repo';
import { GetAddressesQuery } from './get-addresses.query';

@QueryHandler(GetAddressesQuery)
export class GetAddressesHandler implements IQueryHandler<GetAddressesQuery> {
  constructor(private readonly addressQueryRepo: IAddressQueryRepository) {}

  execute(query: GetAddressesQuery): Promise<Address[]> {
    return this.addressQueryRepo.findByUser(query.userId);
  }
}
