import { IQuery } from '@nestjs/cqrs';
import { UserSort } from '../../../domain/enums/user-sort.enum';

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly orderBy?: UserSort,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
