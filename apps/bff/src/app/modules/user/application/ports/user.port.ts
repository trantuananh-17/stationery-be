import { Observable } from 'rxjs';
import { CreateUserRequest, UserResponse } from './dtos/user.dto';
import { Response } from '@common/interfaces/grpc/common/response.interface';

export abstract class UserPort {
  abstract createUser(data: CreateUserRequest): Observable<Response<UserResponse>>;
}
