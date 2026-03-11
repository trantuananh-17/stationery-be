import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateUserRequest,
  UserAuthResponse,
  UserResponse,
} from '../../application/ports/dtos/user.dto';
import { UserPort } from '../../application/ports/grpc/user-grpc.port';
import { UserGrpcService } from './user-grpc.interface';

@Injectable()
export class UserGrpcAdapter implements UserPort, OnModuleInit {
  private userService: UserGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.USER_SERVICE)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService = this.userClient.getService<UserGrpcService>('UserService');
  }

  createUser(data: CreateUserRequest): Promise<UserResponse> {
    return firstValueFrom(this.userService.createUser(data));
  }

  getUserAuth(data: { userId: string }): Promise<UserAuthResponse> {
    return firstValueFrom(this.userService.getUserAuth(data));
  }
}
