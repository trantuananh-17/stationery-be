import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthPort } from './application/ports/auth.port';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { AuthGrpcAdapter } from './infrastructure/grpc/auth-grpc.adapter';

@Module({
  imports: [CqrsModule, ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.AUTH_SERVICE)])],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    AuthGrpcAdapter,
    {
      provide: AuthPort,
      useExisting: AuthGrpcAdapter,
    },
  ],
  exports: [],
})
export class AuthModule {}
