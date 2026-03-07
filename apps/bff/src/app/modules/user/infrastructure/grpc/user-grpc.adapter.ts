import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserRequest, UserResponse } from '../../application/ports/dtos/user.dto';
import { UserPort } from '../../application/ports/user.port';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Response } from '@common/interfaces/grpc/common/response.interface';

@Injectable()
export class UserGrpcAdapter implements UserPort, OnModuleInit {
  private userPort: UserPort;

  constructor(@Inject(GRPC_SERVICES.USER_SERVICE) private readonly userClient: ClientGrpc) {}

  onModuleInit() {
    this.userPort = this.userClient.getService<UserPort>('UserService');
  }

  createUser(data: CreateUserRequest): Observable<Response<UserResponse>> {
    return this.userPort.createUser(data);
  }
}
