import { Observable } from 'rxjs';
import {
  CreateUserRequest,
  UserAuthResponse,
  UserResponse,
} from '../../application/ports/dtos/user.dto';

export interface UserGrpcService {
  createUser(data: CreateUserRequest): Observable<UserResponse>;
  getUserAuth(data: { userId: string }): Observable<UserAuthResponse>;
}
