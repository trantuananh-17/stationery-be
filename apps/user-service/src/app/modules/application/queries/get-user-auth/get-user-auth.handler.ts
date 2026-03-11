import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAuthQuery } from './get-user-auth.query';
import { IUserQueryRepository } from '../../ports/repositories/user-query.repo';
import { GetUserAuthDto } from './get-user-auth.dto';
import { UserNotFound } from '../../../domain/errors/user-not-found.error';

@QueryHandler(GetUserAuthQuery)
export class CreateUserHandler implements IQueryHandler<GetUserAuthQuery> {
  constructor(private readonly userRepo: IUserQueryRepository) {}

  async execute(query: GetUserAuthQuery): Promise<GetUserAuthDto | null> {
    const { userId } = query;

    const payload = await this.userRepo.getPayload(userId);

    if (!payload) {
      throw new UserNotFound();
    }

    return payload;
  }
}
