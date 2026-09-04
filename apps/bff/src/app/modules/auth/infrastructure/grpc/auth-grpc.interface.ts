import { Observable } from 'rxjs';
import {
  LoginUserBodyDto,
  AuthTokenResponse,
  RegisterUserBodyDto,
  UserResponse,
  RefreshTokenBodyDto,
  ForgotPasswordBodyDto,
  ResetPasswordBodyDto,
} from '../../application/ports/dtos/auth.dto';

export interface AuthGrpcService {
  registerUser(data: RegisterUserBodyDto): Observable<UserResponse>;
  loginUser(data: LoginUserBodyDto): Observable<AuthTokenResponse>;
  forgotPassword(data: ForgotPasswordBodyDto): Observable<void>;

  resetPassword(data: ResetPasswordBodyDto): Observable<void>;

  refreshToken(data: RefreshTokenBodyDto): Observable<AuthTokenResponse>;
}
