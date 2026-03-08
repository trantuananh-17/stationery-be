import { CreateUserRequest, UserResponse } from '../dtos/user.dto';

export abstract class UserPort {
  abstract createUser(data: CreateUserRequest): Promise<UserResponse>;
}
