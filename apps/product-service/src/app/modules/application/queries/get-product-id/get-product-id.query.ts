import { IQuery } from '@nestjs/cqrs';

export class GetProductIdQuery implements IQuery {
  constructor(private readonly id: string) {}
}
