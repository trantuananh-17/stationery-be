import { IQuery } from '@nestjs/cqrs';

export class GetCouponsQuery implements IQuery {
  constructor(
    public readonly search: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
