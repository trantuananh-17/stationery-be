import { Observable } from 'rxjs';
import {
  LoginUserBodyDto,
  LoginUserResponse,
  RegisterUserBodyDto,
  UserResponse,
} from '../../application/ports/dtos/auth.dto';

export interface AuthGrpcService {
  registerUser(data: RegisterUserBodyDto): Observable<UserResponse>;
  loginUser(data: LoginUserBodyDto): Observable<LoginUserResponse>;
}
