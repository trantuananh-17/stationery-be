import {
  LoginUserBodyDto,
  AuthTokenResponse,
  RegisterUserBodyDto,
  UserResponse,
  RefreshTokenBodyDto,
  ForgotPasswordBodyDto,
  ResetPasswordBodyDto,
} from './dtos/auth.dto';

export abstract class AuthPort {
  abstract registerUser(data: RegisterUserBodyDto): Promise<UserResponse>;
  abstract loginUser(data: LoginUserBodyDto): Promise<AuthTokenResponse>;
  abstract refreshToken(data: RefreshTokenBodyDto): Promise<AuthTokenResponse>;

  abstract forgotPassword(data: ForgotPasswordBodyDto): Promise<void>;

  abstract resetPassword(data: ResetPasswordBodyDto): Promise<void>;
}
