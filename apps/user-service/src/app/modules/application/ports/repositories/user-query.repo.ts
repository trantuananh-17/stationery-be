import { QueryResult } from '@common/interfaces/common/pagination.interface';
import { UserSort } from '../../../domain/enums/user-sort.enum';
import { GetUserAuthDto } from '../../queries/get-user-auth/get-user-auth.dto';
import { UserDto } from '../../queries/get-users/get-users.dto';
import { UserAdminDetailDto } from '../../queries/get-user/get-user.dto';

export abstract class IUserQueryRepository {
  abstract getPayload(userId: string): Promise<GetUserAuthDto | null>;
  abstract findAll(filters: {
    search?: string;
    orderBy?: UserSort;
    page: number;
    limit: number;
  }): Promise<QueryResult<UserDto>>;

  abstract findById(userId: string): Promise<UserAdminDetailDto | null>;
}
