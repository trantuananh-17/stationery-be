import {
  LoginUserBodyDto,
  AuthTokenResponse,
  RegisterUserBodyDto,
  UserResponse,
  RefreshTokenBodyDto,
} from './dtos/auth.dto';

export abstract class AuthPort {
  abstract registerUser(data: RegisterUserBodyDto): Promise<UserResponse>;
  abstract loginUser(data: LoginUserBodyDto): Promise<AuthTokenResponse>;
  abstract refreshToken(data: RefreshTokenBodyDto): Promise<AuthTokenResponse>;
}
