import { PaginatedResult } from '@common/interfaces/common/pagination.interface';
import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';
import { toTimestamp } from '@common/utils/common.util';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserQueryRepository } from '../../ports/repositories/user-query.repo';
import { UserGrpcDto } from './get-users.dto';
import { GetUsersQuery } from './get-users.query';

export type GetUsersResult = PaginatedResult<UserGrpcDto>;

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery, GetUsersResult> {
  constructor(private readonly userRepo: IUserQueryRepository) {}

  async execute(query: GetUsersQuery): Promise<GetUsersResult> {
    const { search, orderBy, page, limit } = query;

    const normalizedSearch = search?.trim();

    const result = await this.userRepo.findAll({
      search: normalizedSearch,
      orderBy,
      page,
      limit,
    });

    const data: UserGrpcDto[] = result.items.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      totalOrder: user.totalOrder,
      totalPrice: user.totalPrice,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: toTimestamp(user.createdAt) as GrpcTimestamp,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.total > 0 ? Math.ceil(result.total / limit) : 0,
      },
    };
  }
}
