import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserPort } from '../../application/ports/grpc/user-grpc.port';
import { UserGrpcService } from './user-grpc.interface';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { CreateUserRequest, UserResponse } from '../../application/ports/dtos/user.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

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
}
