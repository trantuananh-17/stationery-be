import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserGrpcAdapter } from './infrastructure/grpc/user-grpc.adapter';
import { UserController } from './presentation/controllers/user.controller';
import { UserPort } from './application/ports/user.port';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_SERVICE)]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserPort,
      useClass: UserGrpcAdapter,
    },
  ],
  exports: [],
})
export class UserModule {}
