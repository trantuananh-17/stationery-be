import { IQuery } from '@nestjs/cqrs';

export class GetUserAuthQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
