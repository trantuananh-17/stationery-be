import { IQuery } from '@nestjs/cqrs';

export class GetInventoriesQuery implements IQuery {
  constructor(
    public readonly search: string | undefined,
    public readonly lowStockThreshold: number | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
