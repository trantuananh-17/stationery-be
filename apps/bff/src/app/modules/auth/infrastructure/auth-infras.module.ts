import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { AuthGrpcAdapter } from './grpc/auth-grpc.adapter';
import { AuthPort } from '../application/ports/auth.port';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.AUTH_SERVICE)])],
  providers: [
    AuthGrpcAdapter,
    {
      provide: AuthPort,
      useExisting: AuthGrpcAdapter,
    },
  ],
  exports: [AuthPort],
})
export class AuthInfrasModule {}
