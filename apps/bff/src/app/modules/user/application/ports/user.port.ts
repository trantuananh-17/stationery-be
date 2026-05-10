import {
  CreateUserRequest,
  UserAuthResponse,
  UserResponse,
  UsersResponse,
  UserAdminDetailResponse,
} from './dtos/user.dto';

export abstract class UserPort {
  abstract createUser(data: CreateUserRequest): Promise<UserResponse>;

  abstract getUserAuth(data: { userId: string }): Promise<UserAuthResponse>;

  abstract getUsers(data: {
    search?: string;
    orderBy?: string;

    page?: number;
    limit?: number;
  }): Promise<UsersResponse>;

  abstract getUser(data: { userId: string }): Promise<UserAdminDetailResponse>;
}
