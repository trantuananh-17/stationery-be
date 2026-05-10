import { Observable } from 'rxjs';

import {
  CreateUserRequest,
  GetUsersRequest,
  UserAdminDetailResponse,
  UserAuthResponse,
  UserResponse,
  UsersResponse,
} from '../../application/ports/dtos/user.dto';

export interface IUserGrpcService {
  createUser(data: CreateUserRequest): Observable<UserResponse>;

  getUserAuth(data: { userId: string }): Observable<UserAuthResponse>;

  getUsers(data: GetUsersRequest): Observable<UsersResponse>;

  getUser(data: { userId: string }): Observable<UserAdminDetailResponse>;
}
