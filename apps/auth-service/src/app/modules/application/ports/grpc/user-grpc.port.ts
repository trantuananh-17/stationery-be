import { CreateUserRequest, UserAuthResponse, UserResponse } from '../dtos/user.dto';

export abstract class UserPort {
  abstract createUser(data: CreateUserRequest): Promise<UserResponse>;

  abstract getUserAuth(data: { userId: string }): Promise<UserAuthResponse>;
}
