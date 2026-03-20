import { IQuery } from '@nestjs/cqrs';
import { ProductOrderBy } from '../../../domain/enum/product-orderby.enum';

export class GetProductsQuery implements IQuery {
  constructor(
    public readonly search?: string,
    public readonly categorySlug?: string,
    public readonly brandSlug?: string,
    public readonly orderBy?: ProductOrderBy,
    public readonly page = 1,
    public readonly limit = 8,
  ) {}
}
