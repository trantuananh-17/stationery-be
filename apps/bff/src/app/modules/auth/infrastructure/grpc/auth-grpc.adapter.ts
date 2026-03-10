import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthPort } from '../../application/ports/auth.port';
import { RegisterUserBodyDto, UserResponse } from '../../application/ports/dtos/auth.dto';
import { AuthGrpcService } from './auth-grpc.interface';

@Injectable()
export class AuthGrpcAdapter implements AuthPort, OnModuleInit {
  private authService: AuthGrpcService;

  constructor(
    @Inject(GRPC_SERVICES.AUTH_SERVICE)
    private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.authService = this.authClient.getService<AuthGrpcService>('AuthorizerService');
  }

  registerUser(data: RegisterUserBodyDto): Promise<UserResponse> {
    return firstValueFrom(this.authService.registerUser(data));
  }
}
