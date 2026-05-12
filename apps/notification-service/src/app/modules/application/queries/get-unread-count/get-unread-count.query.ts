import { IQuery } from '@nestjs/cqrs';

export class GetUnreadCountQuery implements IQuery {
  constructor(public readonly receiverId: string) {}
}
