import {
  LoginUserBodyDto,
  LoginUserResponse,
  RegisterUserBodyDto,
  UserResponse,
} from './dtos/auth.dto';

export abstract class AuthPort {
  abstract registerUser(data: RegisterUserBodyDto): Promise<UserResponse>;
  abstract loginUser(data: LoginUserBodyDto): Promise<LoginUserResponse>;
}
