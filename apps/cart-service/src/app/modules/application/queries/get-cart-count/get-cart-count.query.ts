import { IQuery } from '@nestjs/cqrs';

export class GetCartCountQuery implements IQuery {
  constructor(
    public readonly userId?: string,
    public readonly sessionId?: string,
  ) {}
}
