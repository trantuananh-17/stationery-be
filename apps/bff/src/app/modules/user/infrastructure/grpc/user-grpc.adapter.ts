import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CreateUserRequest,
  GetUsersRequest,
  UserAdminDetailResponse,
  UserAuthResponse,
  UserResponse,
  UsersResponse,
} from '../../application/ports/dtos/user.dto';

import { UserPort } from '../../application/ports/user.port';

import { IUserGrpcService } from './user-grpc.interface';

@Injectable()
export class UserGrpcAdapter implements UserPort, OnModuleInit {
  private userService: IUserGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.USER_SERVICE)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService = this.userClient.getService<IUserGrpcService>('UserService');
  }

  createUser(data: CreateUserRequest): Promise<UserResponse> {
    return firstValueFrom(this.userService.createUser(data));
  }

  getUserAuth(data: { userId: string }): Promise<UserAuthResponse> {
    return firstValueFrom(this.userService.getUserAuth(data));
  }

  getUsers(data: GetUsersRequest): Promise<UsersResponse> {
    return firstValueFrom(this.userService.getUsers(data));
  }

  getUser(data: { userId: string }): Promise<UserAdminDetailResponse> {
    return firstValueFrom(this.userService.getUser(data));
  }
}
