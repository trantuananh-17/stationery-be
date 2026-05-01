import { IQuery } from '@nestjs/cqrs';
import { AdminProductOrderBy } from '../../../domain/enum/product-orderby.enum';
import { ProductStatus } from '../../../domain/enum/product-status.enum';

export class GetProductsByAdminQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly status?: ProductStatus,
    public readonly orderBy?: AdminProductOrderBy,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
