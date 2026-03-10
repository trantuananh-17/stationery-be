import { Observable } from 'rxjs';
import { CreateUserRequest, UserResponse } from '../../application/ports/dtos/user.dto';

export interface UserGrpcService {
  createUser(data: CreateUserRequest): Observable<UserResponse>;
}
