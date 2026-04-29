import { Observable } from 'rxjs';
import {
  LoginUserBodyDto,
  AuthTokenResponse,
  RegisterUserBodyDto,
  UserResponse,
  RefreshTokenBodyDto,
} from '../../application/ports/dtos/auth.dto';

export interface AuthGrpcService {
  registerUser(data: RegisterUserBodyDto): Observable<UserResponse>;
  loginUser(data: LoginUserBodyDto): Observable<AuthTokenResponse>;
  refreshToken(data: RefreshTokenBodyDto): Observable<AuthTokenResponse>;
}
