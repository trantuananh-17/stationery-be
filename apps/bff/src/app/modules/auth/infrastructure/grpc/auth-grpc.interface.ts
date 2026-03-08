import { Observable } from 'rxjs';
import { RegisterUserBodyDto, UserResponse } from '../../application/ports/dtos/auth.dto';

export interface AuthGrpcService {
  registerUser(data: RegisterUserBodyDto): Observable<UserResponse>;
}
